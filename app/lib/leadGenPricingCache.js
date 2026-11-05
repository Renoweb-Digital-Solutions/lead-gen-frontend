import {
  normalizeLeadGenPricing,
  PIPELINE_PRICING_OPERATIONS,
} from "./leadGenPricing";

const DATABASE = "simpleads-credit-pricing";
const STORE = "rules";
// # Each module owns its request, storage key and refresh generation.
// # Switching modules reuses rules without replacing another module's in-flight refresh.
const pageRequests = new Map();
const generations = new Map();

// # IndexedDB is optional: blocked storage must not prevent a fresh network estimate from rendering.
async function pricingStorage(operation, mode, value, requestGeneration) {
  const key = `SIMPLEADS:${operation}`;
  if (typeof indexedDB === "undefined")
    throw new Error("Browser storage is unavailable.");
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    let expired = false;
    const timer = setTimeout(() => {
      expired = true;
      reject(new Error("Browser storage timed out."));
    }, 1500);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE))
        request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => {
      clearTimeout(timer);
      if (expired) request.result.close();
      else resolve(request.result);
    };
    request.onerror = request.onblocked = () => {
      expired = true;
      clearTimeout(timer);
      reject(new Error("Browser storage is unavailable."));
    };
  });
  try {
    // # A refresh may have started while IndexedDB was opening; do not persist the older response afterward.
    if (
      mode === "readwrite" &&
      requestGeneration !== (generations.get(operation) || 0)
    ) {
      return;
    }
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const store = transaction.objectStore(STORE);
      const request =
        mode === "readonly" ? store.get(key) : store.put(value, key);
      let result;
      request.onsuccess = () => {
        result = request.result;
      };
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = transaction.onabort = () =>
        reject(new Error("Browser pricing storage failed."));
    });
  } finally {
    db.close();
  }
}

// # Manual refresh invalidates only the selected operation and prevents older writes from winning.
export function resetPipelinePricing(operation) {
  generations.set(operation, (generations.get(operation) || 0) + 1);
  pageRequests.delete(operation);
}

// # Fetch once per operation per document, independently of form options and result sliders.
// # Saved rules are an explicit offline fallback, never evidence that pricing is current.
export function loadPipelinePricing(operation) {
  if (!PIPELINE_PRICING_OPERATIONS.includes(operation)) {
    return Promise.reject(new Error("Unsupported pricing operation."));
  }
  if (!pageRequests.has(operation)) {
    const requestGeneration = generations.get(operation) || 0;
    const pageRequest = (async () => {
      try {
        const response = await fetch(
          `/api/leadgen/pricing?operation=${encodeURIComponent(operation)}`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Pricing request failed.");
        const pricing = normalizeLeadGenPricing(await response.json(), operation);
        if (requestGeneration === (generations.get(operation) || 0)) {
          // # Persist in the background so slow or restricted storage cannot block the UI.
          void pricingStorage(
            operation,
            "readwrite",
            { pricing, fetchedAt: Date.now() },
            requestGeneration,
          ).catch(() => {});
        }
        return { pricing, cached: false };
      } catch {
        const saved = await pricingStorage(operation, "readonly").catch(() => null);
        if (!saved?.pricing) {
          throw new Error("Pricing is not available for this module yet.");
        }
        return {
          pricing: normalizeLeadGenPricing(saved.pricing, operation),
          cached: true,
        };
      }
    })();
    pageRequests.set(operation, pageRequest);
  }
  return pageRequests.get(operation);
}

// # Preserve the existing Lead Gen callers and their lead-based calculation behavior.
export function resetLeadGenPricing() {
  resetPipelinePricing("LEAD_GEN_PIPELINE");
}

export function loadLeadGenPricing() {
  return loadPipelinePricing("LEAD_GEN_PIPELINE");
}
