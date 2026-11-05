// # Only these public Simpleads operations may be requested by the browser.
// # Rules declare whether the estimate quantity is a run or the selected result count.
export const PIPELINE_PRICING_OPERATIONS = [
  "LEAD_GEN_PIPELINE",
  "GOOGLE_MAPS",
  "YOUTUBE_SCRAPER",
  "INSTAGRAM_SCRAPER",
  "B2B_SCRAPER",
  "INVESTOR_DATA_PIPELINE",
];

// # Validation is shared by server responses and IndexedDB fallback records.
// # Match the requested operation so cached prices from another module cannot leak into an estimate.
export function normalizeLeadGenPricing(
  value,
  operation = "LEAD_GEN_PIPELINE",
) {
  if (
    !value ||
    value.application !== "SIMPLEADS" ||
    value.operation !== operation ||
    !PIPELINE_PRICING_OPERATIONS.includes(operation) ||
    !Number.isSafeInteger(value.version) ||
    value.version < 1
  )
    throw new Error("Invalid Lead Gen pricing.");
  const conf = value.pricingConfig;
  const amount = (number) =>
    typeof number === "number" && Number.isFinite(number) && number >= 0;
  let pricingConfig;
  if (conf?.type === "DYNAMIC_FEATURES") {
    if (!amount(conf.basePricePerUnit)) throw new Error("Invalid base price.");
    // # Copy numeric values only; connection details and unrelated database fields never reach storage.
    const readMap = (map = {}) => {
      if (
        !map ||
        typeof map !== "object" ||
        Array.isArray(map) ||
        !Object.values(map).every(amount)
      )
        throw new Error("Invalid pricing features.");
      return Object.fromEntries(Object.entries(map));
    };
    pricingConfig = {
      type: conf.type,
      basePricePerUnit: conf.basePricePerUnit,
      addons: readMap(conf.addons),
      // # Fixed run extras are display metadata; FastAPI reserves their service sub-operations.
      fixedAddons: readMap(conf.fixedAddons),
      multipliers: readMap(conf.multipliers),
    };
  } else if (conf?.type === "FLAT_TIERS") {
    if (!Array.isArray(conf.tiers) || !conf.tiers.length)
      throw new Error("Invalid pricing tiers.");
    pricingConfig = {
      type: conf.type,
      tiers: conf.tiers.map((tier) => {
        if (
          !Number.isSafeInteger(tier.minQuantity) ||
          tier.minQuantity < 1 ||
          (tier.maxQuantity !== undefined &&
            (!Number.isSafeInteger(tier.maxQuantity) ||
              tier.maxQuantity < tier.minQuantity)) ||
          !Number.isSafeInteger(tier.credits) ||
          tier.credits < 0
        )
          throw new Error("Invalid pricing tier.");
        return {
          minQuantity: tier.minQuantity,
          ...(tier.maxQuantity === undefined
            ? {}
            : { maxQuantity: tier.maxQuantity }),
          credits: tier.credits,
        };
      }),
    };
  } else throw new Error("Unsupported pricing type.");
  // # Quantity metadata controls the preview input, not the Credit Service price formula.
  // # The service already multiplies basePricePerUnit by its supplied quantity.
  const quantityUnit =
    conf.quantityUnit ?? (operation === "LEAD_GEN_PIPELINE" ? "RESULT" : "RUN");
  if (!["RESULT", "RUN"].includes(quantityUnit)) {
    throw new Error("Invalid pricing quantity unit.");
  }
  if (
    conf.defaultQuantity !== undefined &&
    (!Number.isSafeInteger(conf.defaultQuantity) || conf.defaultQuantity < 1)
  ) {
    throw new Error("Invalid default pricing quantity.");
  }
  pricingConfig.quantityUnit = quantityUnit;
  if (conf.defaultQuantity !== undefined) {
    pricingConfig.defaultQuantity = conf.defaultQuantity;
  }
  if (conf.minimumQuantity !== undefined) {
    if (
      !Number.isSafeInteger(conf.minimumQuantity) ||
      conf.minimumQuantity < 1
    ) {
      throw new Error("Invalid minimum pricing quantity.");
    }
    pricingConfig.minimumQuantity = conf.minimumQuantity;
  }
  if (!value.effectiveFrom) throw new Error("Missing pricing effective date.");
  const effectiveFrom = new Date(value.effectiveFrom).toISOString();
  const effectiveTo = value.effectiveTo
    ? new Date(value.effectiveTo).toISOString()
    : undefined;
  return {
    application: value.application,
    operation: value.operation,
    version: value.version,
    pricingConfig,
    effectiveFrom,
    ...(effectiveTo ? { effectiveTo } : {}),
  };
}

// # The credit panel uses the same operation order, tier selection and upward rounding as Credit Service.
// # This is a display estimate only; browser-stored rules never authorize a financial transaction.
export function calculateLeadGenEstimate(pricing, quantity, features = []) {
  if (
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    (pricing.operation === "LEAD_GEN_PIPELINE" && quantity > 1000)
  ) {
    throw new Error("Choose a valid result count.");
  }
  // # Minimum quantities come from the cached rule, rather than a hardcoded frontend price.
  quantity = Math.max(quantity, pricing.pricingConfig.minimumQuantity || 1);
  const now = Date.now();
  if (
    new Date(pricing.effectiveFrom).getTime() > now ||
    (pricing.effectiveTo && new Date(pricing.effectiveTo).getTime() <= now)
  )
    throw new Error("Pricing has expired. Please refresh.");
  const conf = pricing.pricingConfig;
  let credits;
  if (conf.type === "FLAT_TIERS") {
    const tier = conf.tiers.find(
      (item) =>
        quantity >= item.minQuantity &&
        (item.maxQuantity === undefined || quantity <= item.maxQuantity),
    );
    if (!tier) throw new Error("No pricing is available for this lead count.");
    credits = tier.credits;
  } else {
    let unitCost = conf.basePricePerUnit;
    let multiplier = 1;
    for (const feature of features) {
      if (Object.hasOwn(conf.addons, feature) && conf.addons[feature])
        unitCost += conf.addons[feature];
      if (Object.hasOwn(conf.multipliers, feature) && conf.multipliers[feature])
        multiplier *= conf.multipliers[feature];
    }
    credits = Math.ceil(unitCost * quantity * multiplier);
    // # Unlike per-channel addons, fixed extras are added once after quantity pricing.
    for (const feature of new Set(features)) {
      credits += conf.fixedAddons?.[feature] || 0;
    }
  }
  if (!Number.isSafeInteger(credits) || credits < 0)
    throw new Error("Invalid run estimate.");
  return { quantity, credits, pricingVersion: pricing.version };
}
