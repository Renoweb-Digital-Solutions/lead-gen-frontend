"use client";

import { useEffect, useId, useRef } from "react";
import { FEEDBACK_PIPELINE_EVENT } from "../lib/feedback";

export default function usePipelineFeedback(pipeline, running) {
  const id = useId();
  const wasRunning = useRef(false);
  useEffect(() => {
    // # Observe existing run state without awaiting feedback or changing pipeline handlers.
    // # Only a running-to-settled transition creates a feedback opportunity.
    if (running || wasRunning.current) {
      window.dispatchEvent(new CustomEvent(FEEDBACK_PIPELINE_EVENT, { detail: { id, pipeline, type: running ? "started" : "finished" } }));
    }
    wasRunning.current = running;
  }, [id, pipeline, running]);
  useEffect(() => () => {
    // # Leaving a tool removes its busy marker without pretending the run completed.
    window.dispatchEvent(new CustomEvent(FEEDBACK_PIPELINE_EVENT, { detail: { id, pipeline, type: "left" } }));
  }, [id, pipeline]);
}
