import { normalizeLeadGenPricing } from "./leadGenPricing";

const DATABASE = "simpleads-credit-pricing";
const STORE = "rules";
const KEY = "SIMPLEADS:LEAD_GEN_PIPELINE";
let pageRequest;
let generation = 0;

// # IndexedDB is optional: blocked storage must not prevent a fresh network estimate from rendering.
async function pricingStorage(mode, value, requestGeneration) {
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
    if (mode === "readwrite" && requestGeneration !== generation) return;
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const store = transaction.objectStore(STORE);
      const request =
        mode === "readonly" ? store.get(KEY) : store.put(value, KEY);
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

// # A manual Refresh starts a new read; older requests may not overwrite the newer IndexedDB record.
export function resetLeadGenPricing() {
  generation += 1;
  pageRequest = undefined;
}

// # LeadGenCredits calls this once per document/session, never in response to slider or feature changes.
// # Always try fresh rules on page open; IndexedDB is a labeled offline fallback rather than a freshness signal.
export function loadLeadGenPricing() {
  if (!pageRequest) {
    const requestGeneration = generation;
    pageRequest = (async () => {
      try {
        const response = await fetch("/api/leadgen/pricing", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Pricing request failed.");
        const pricing = normalizeLeadGenPricing(await response.json());
        if (requestGeneration === generation) {
          // # Storage runs in the background so restricted/slow IndexedDB does not stall the slider.
          void pricingStorage(
            "readwrite",
            { pricing, fetchedAt: Date.now() },
            requestGeneration,
          ).catch(() => {});
        }
        return { pricing, cached: false };
      } catch {
        const saved = await pricingStorage("readonly").catch(() => null);
        if (!saved?.pricing)
          throw new Error(
            "Run pricing is unavailable. Please refresh to try again.",
          );
        return {
          pricing: normalizeLeadGenPricing(saved.pricing),
          cached: true,
        };
      }
    })();
  }
  return pageRequest;
}
