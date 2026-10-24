"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { CONTROL_LABELS, MODULE_LABELS, safeControlValue } from "../lib/interactionAnalytics";

const AnalyticsContext = createContext({ trackEvent: () => {} });

export function AnalyticsProvider({ children }) {
  const receiver = useRef(null);
  const trackEvent = useCallback((eventName, properties = {}, module) => {
    // # Optional analytics is a no-op until the browser runtime is ready.
    try { receiver.current?.({ eventName, module, properties }); } catch { /* # Fail open. */ }
  }, []);

  useEffect(() => {
    // # Operations can disable collection without touching any product handler.
    if (process.env.NEXT_PUBLIC_INTERACTION_ANALYTICS_ENABLED === "false") return;
    // # Keep the queue in memory: no form data or JWTs are persisted for delivery.
    let queue = [], owner = null, session = null, lastActivity = 0, sending = false, failures = 0, sequence = 0;
    let activeToken = null, activeRequest = null, dragControl = null;
    let viewedModules = new Set();
    const abort = new AbortController();
    const observed = new WeakSet();
    const pendingViews = new Map();
    const deferred = new Set();
    const lastOptions = new Map();
    const makeId = () => crypto.randomUUID();
    const visible = element => !!element?.getClientRects().length && document.visibilityState === "visible";
    const identity = () => {
      try {
        const token = localStorage.getItem("renoweb_jwt");
        if (!token) return null;
        const raw = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const data = JSON.parse(atob(raw));
        if (data.is_admin || !data.sub || data.exp * 1000 <= Date.now()) return null;
        return { token, key: data.sub };
      } catch { return null; }
    };
    const enqueue = ({ eventName, module, properties = {} }) => {
      // # Only customer dashboard activity is eligible; the server verifies the JWT again.
      if (!window.location.pathname.startsWith("/dashboard") || !MODULE_LABELS[module]) return;
      const user = identity();
      if (!user) return;
      if (owner !== user.key || Date.now() - lastActivity > 30 * 60 * 1000) {
        queue = []; owner = user.key; session = makeId(); lastOptions.clear(); viewedModules = new Set();
      }
      activeToken = user.token;
      lastActivity = Date.now();
      // # A new idle/login session must begin with its currently used module.
      if (!viewedModules.has(module)) {
        viewedModules.add(module);
        if (eventName !== "module_viewed") queue.push({ event_id: makeId(), session_id: session, module, event_name: "module_viewed", properties: {}, sequence: Date.now() * 1000 + (sequence++ % 1000) });
      }
      if (queue.length >= 160) queue.shift();
      queue.push({ event_id: makeId(), session_id: session, module, event_name: eventName, properties, sequence: Date.now() * 1000 + (sequence++ % 1000) });
    };
    receiver.current = enqueue;
    const flush = async (unloading = false) => {
      // # Direct fetch deliberately avoids the app's auth helper and its logout redirects.
      if (sending || !queue.length || !process.env.NEXT_PUBLIC_API_URL) return;
      const user = identity();
      if (!user || user.key !== owner || user.token !== activeToken) { queue = []; return; }
      const batch = queue.splice(0, 40);
      sending = true;
      const controller = new AbortController();
      activeRequest = controller;
      const timeout = window.setTimeout(() => controller.abort(), 4000);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/batch`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
          body: JSON.stringify({ events: batch }), keepalive: unloading, signal: controller.signal,
        });
        if (!response.ok && response.status >= 500) throw new Error("Unavailable");
        failures = 0;
      } catch {
        // # IDs survive at most two retries; memory use and outage traffic stay bounded.
        if (++failures <= 2 && !unloading && owner === user.key && identity()?.token === user.token) queue = [...batch, ...queue].slice(0, 160);
      } finally { sending = false; activeRequest = null; window.clearTimeout(timeout); }
    };
    const scopeFor = element => {
      const scope = element?.closest?.("[data-analytics-module]");
      return visible(scope) ? scope : null;
    };
    const settings = scope => {
      const snapshot = {};
      scope?.querySelectorAll("[data-analytics-control]").forEach(element => {
        const control = element.dataset.analyticsControl;
        if (!CONTROL_LABELS[control] || !visible(element)) return;
        const value = safeControlValue(element);
        if (control === "countries") {
          if (element.checked) snapshot[control] = [...(snapshot[control] || []), element.dataset.analyticsValue].slice(0, 30);
        } else if (value !== null) snapshot[control] = value;
      });
      return snapshot;
    };
    const click = event => {
      try {
        const element = event.target.closest?.("[data-analytics-action], [data-analytics-control][data-analytics-value]");
        const scope = scopeFor(element);
        if (!scope || element.disabled || element.getAttribute("aria-disabled") === "true") return;
        const moduleId = scope.dataset.analyticsModule;
        const action = element.dataset.analyticsAction;
        if (action) {
          enqueue({ eventName: "button_clicked", module: moduleId, properties: { action } });
          if (action.startsWith("export_")) enqueue({ eventName: "export_requested", module: moduleId, properties: { action } });
        }
        if (element.dataset.analyticsControl && !element.hasAttribute("data-analytics-slider") && !["INPUT", "SELECT"].includes(element.tagName)) {
          if (element.getAttribute("aria-pressed") === "true") return;
          enqueue({ eventName: "option_changed", module: moduleId, properties: { control: element.dataset.analyticsControl, value: safeControlValue(element) } });
        }
      } catch { /* # Passive observers never change event propagation or product state. */ }
    };
    const change = event => {
      try {
        const element = event.target;
        const scope = scopeFor(element);
        const control = element.dataset?.analyticsControl;
        if (!scope || !CONTROL_LABELS[control]) return;
        const value = safeControlValue(element);
        if (value === null) return;
        const key = `${scope.dataset.analyticsModule}:${control}:${element.dataset.analyticsValue || ""}`;
        if (lastOptions.get(key) === JSON.stringify(value)) return;
        lastOptions.set(key, JSON.stringify(value));
        enqueue({ eventName: "option_changed", module: scope.dataset.analyticsModule, properties: { control, value: control === "countries" ? `${element.dataset.analyticsValue}_${value ? "selected" : "removed"}` : value } });
      } catch { /* # No free-text input inspection. */ }
    };
    const bridge = event => {
      // # Submissions come from actual handlers; snapshots exclude untagged/free-text fields.
      const { eventName, module, properties } = event.detail || {};
      const scope = document.querySelector(`[data-analytics-module="${MODULE_LABELS[module] ? module : "unknown"}"]`);
      enqueue({ eventName, module, properties: eventName === "run_submitted" ? { ...properties, settings: { ...settings(scope), ...properties?.settings } } : properties });
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      for (const entry of entries) {
        const element = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && scopeFor(element)) {
          if (pendingViews.has(element)) continue;
          pendingViews.set(element, window.setTimeout(() => {
            pendingViews.delete(element);
            const scope = scopeFor(element);
            if (!scope || !visible(element)) return;
            enqueue({ eventName: element.dataset.analyticsSection === "results" ? "results_viewed" : "section_viewed", module: scope.dataset.analyticsModule, properties: { section: element.dataset.analyticsSection } });
            observer.unobserve(element);
          }, 1000));
        } else if (pendingViews.has(element)) {
          window.clearTimeout(pendingViews.get(element)); pendingViews.delete(element);
        }
      }
    }, { threshold: 0.5 });
    const discover = () => {
      if (!window.location.pathname.startsWith("/dashboard")) return;
      document.querySelectorAll("[data-analytics-section]").forEach(element => {
        if (!observed.has(element)) { observed.add(element); observer?.observe(element); }
      });
    };
    const mutation = new MutationObserver(discover);
    mutation.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-analytics-section"] });
    discover();
    document.addEventListener("click", click, { capture: true, signal: abort.signal });
    document.addEventListener("change", change, { capture: true, signal: abort.signal });
    // # Read a slider's final approved numeric value once after pointer interaction.
    document.addEventListener("pointerdown", event => {
      const element = event.target.closest?.("[data-analytics-slider]");
      dragControl = element ? { element, value: element.dataset.analyticsValue } : null;
    }, { capture: true, signal: abort.signal });
    document.addEventListener("pointerup", () => {
      const drag = dragControl; dragControl = null;
      if (drag) {
        const timer = window.setTimeout(() => {
        deferred.delete(timer);
        const { element, value } = drag;
        const scope = scopeFor(element);
        if (scope && element.dataset.analyticsValue !== value) enqueue({ eventName: "option_changed", module: scope.dataset.analyticsModule, properties: { control: element.dataset.analyticsControl, value: Number(element.dataset.analyticsValue) } });
        }, 0);
        deferred.add(timer);
      }
    }, { capture: true, signal: abort.signal });
    window.addEventListener("simpleads:interaction", bridge, { signal: abort.signal });
    const reset = () => { activeRequest?.abort(); queue = []; owner = null; session = null; lastOptions.clear(); viewedModules = new Set(); };
    window.addEventListener("simpleads:session-changed", reset, { signal: abort.signal });
    window.addEventListener("storage", reset, { signal: abort.signal });
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") void flush(true); }, { signal: abort.signal });
    window.addEventListener("pagehide", () => void flush(true), { signal: abort.signal });
    const interval = window.setInterval(() => void flush(), 5000);
    return () => {
      // # Strict-mode remounts clean up every listener, timer and observer.
      receiver.current = null; activeRequest?.abort(); abort.abort(); mutation.disconnect(); observer?.disconnect();
      pendingViews.forEach(timeout => window.clearTimeout(timeout)); window.clearInterval(interval);
      deferred.forEach(timeout => window.clearTimeout(timeout));
    };
  }, []);

  return <AnalyticsContext.Provider value={{ trackEvent }}>{children}</AnalyticsContext.Provider>;
}

export const useAnalytics = () => useContext(AnalyticsContext);
