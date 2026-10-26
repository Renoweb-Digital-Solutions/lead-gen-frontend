"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, MessageCircleHeart, RefreshCw } from "lucide-react";
import { feedbackApi } from "../lib/api";
import { FEEDBACK_PIPELINES, FEEDBACK_RATINGS } from "../lib/feedback";
import styles from "./FeedbackInbox.module.css";

export default function FeedbackInbox({ refreshKey }) {
  const [rating, setRating] = useState("");
  const [pipeline, setPipeline] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [data, setData] = useState({ feedback: [], total: 0, pages: 1, loading: true, error: "" });

  useEffect(() => {
    // # The inbox owns its loading/error state and reads ten server-paginated rows at a time.
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setData((current) => ({ ...current, loading: true, error: "" }));
      try {
        const query = new URLSearchParams({ page: String(page) });
        if (rating) query.set("rating", rating);
        if (pipeline) query.set("pipeline", pipeline);
        const response = await feedbackApi(`/admin/feedback?${query}`, undefined, controller.signal);
        if (!Array.isArray(response.feedback) || !Number.isInteger(response.total)) throw new Error("Invalid feedback response.");
        if (!cancelled) setData({ ...response, loading: false, error: "" });
      } catch (exception) {
        if (!cancelled) setData((current) => ({ ...current, loading: false, error: exception.status === 403 ? "Only admins can view feedback." : "Feedback could not be loaded. Please try again." }));
      }
    }, 0);
    return () => { cancelled = true; clearTimeout(timer); controller.abort(); };
  }, [page, rating, pipeline, reload, refreshKey]);

  const changeFilter = (setter, value) => { setter(value); setPage(1); };
  return <section className={styles.inbox}>
    <div className={styles.header}><div><span className={styles.eyebrow}>CUSTOMER VOICES</span><h2>A little feedback. A better tool.</h2><p>Emoji ratings and optional comments, straight from your users.</p></div><button type="button" onClick={() => setReload((value) => value + 1)} disabled={data.loading}><RefreshCw size={15} />Refresh</button></div>
    <div className={styles.toolbar}>
      <label>Rating<select value={rating} onChange={(event) => changeFilter(setRating, event.target.value)}><option value="">All ratings</option>{FEEDBACK_RATINGS.map((item) => <option value={item.value} key={item.value}>{item.emoji} {item.label} ({item.value}/5)</option>)}</select></label>
      <label>Pipeline<select value={pipeline} onChange={(event) => changeFilter(setPipeline, event.target.value)}><option value="">All pipelines</option>{Object.entries(FEEDBACK_PIPELINES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      {!data.loading && !data.error && <span className={styles.total}>{data.total} {data.total === 1 ? "response" : "responses"}</span>}
    </div>
    {data.loading ? <div className={styles.empty} role="status"><Loader2 size={24} className={styles.spin} /><p>Loading feedback...</p></div> : data.error ? <div className={styles.error} role="alert"><p>{data.error}</p><button type="button" onClick={() => setReload((value) => value + 1)}>Try again</button></div> : !data.feedback.length ? <div className={styles.empty}><MessageCircleHeart size={30} /><h3>{rating || pipeline ? "No matching feedback" : "Your users will have a say here."}</h3><p>{rating || pipeline ? "Try another rating or pipeline." : "When someone submits their rating, it will appear here with their name and comment."}</p></div> : <>
      <div className={styles.list}>{data.feedback.map((item) => {
        const selected = FEEDBACK_RATINGS.find((entry) => entry.value === item.rating);
        return <article key={item.id} className={styles.item}>
          <div className={styles.customer}><span className={styles.initial} aria-hidden="true">{item.username?.charAt(0).toUpperCase()}</span><div><strong>{item.username}</strong><span>{item.email || "No email on record"}</span></div></div>
          <div className={styles.response}><div className={styles.rating}><span aria-hidden="true">{selected?.emoji}</span><strong>{selected?.label || "Rating"}</strong><small>{item.rating}/5</small></div>
            {/* # React escapes comments; preserve their original line breaks as plain text. */}
            {item.comment ? <p className={styles.comment}>{item.comment}</p> : <p className={styles.noComment}>Rating only &mdash; no comment added.</p>}
            <div className={styles.metadata}><span>{FEEDBACK_PIPELINES[item.pipeline] || item.pipeline}</span><time dateTime={item.submitted_at}>{new Date(item.submitted_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST</time></div>
          </div>
        </article>;
      })}</div>
      <nav className={styles.pagination} aria-label="Feedback pages"><span>Showing {(page - 1) * 10 + 1}&ndash;{Math.min(page * 10, data.total)} of {data.total}</span><div><button type="button" aria-label="Previous feedback page" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={15} /></button><span>Page {page} of {data.pages}</span><button type="button" aria-label="Next feedback page" disabled={page >= data.pages} onClick={() => setPage((value) => value + 1)}><ChevronRight size={15} /></button></div></nav>
    </>}
  </section>;
}
