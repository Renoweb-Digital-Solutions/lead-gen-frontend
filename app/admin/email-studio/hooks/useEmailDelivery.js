import { useRef, useState } from "react";
import { adminEmailApi } from "../../../lib/api";

// Delivery owns the retry payload so UI edits cannot create duplicate sends.
export default function useEmailDelivery() {
  const pending = useRef(null);
  const [uncertain, setUncertain] = useState(false);
  const [result, setResult] = useState(null);

  async function sendBatch(payload) {
    if (!pending.current) {
      pending.current = { ...payload, request_id: crypto.randomUUID() };
    }

    let response;
    try {
      response = await adminEmailApi("/send", pending.current);
    } catch (error) {
      if (error.status) {
        pending.current = null;
        setUncertain(false);
      } else {
        setUncertain(true);
      }
      throw error;
    }

    if (response.status === "sending") {
      setUncertain(true);
      return null;
    }

    pending.current = null;
    setUncertain(false);
    setResult(response);
    return response;
  }

  return { result, uncertain, sendBatch, clearResult: () => setResult(null) };
}
