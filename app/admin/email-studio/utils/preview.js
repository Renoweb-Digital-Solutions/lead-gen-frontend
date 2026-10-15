import { personalize } from "./personalization";

const PREVIEW_STYLES = `
  body {
    margin: 0;
    padding: 24px;
    background: #eef3fc;
    color: #17233c;
    font: 14px/1.8 Arial, sans-serif;
  }
  article {
    max-width: 580px;
    margin: auto;
    background: white;
    border: 1px solid #dce6f7;
    border-radius: 18px;
    overflow: hidden;
  }
  header {
    padding: 28px;
    background: linear-gradient(120deg, #023dbb, #308fef);
    color: white;
  }
  main { padding: 28px; }
  footer {
    padding: 20px 28px;
    background: #f7faff;
    color: #64748b;
    font-size: 12px;
    text-align: center;
  }
  a { color: #023dbb; }
  blockquote { border-left: 3px solid #308fef; padding-left: 15px; }
`;

// Keep the standalone email document separate from the modal's layout and state.
export function buildEmailPreview({ body, user, marketing }) {
  const unsubscribe = marketing
    ? '<p style="font-size:12px;color:#64748b">Prefer fewer emails? <u>Unsubscribe from marketing</u>.</p>'
    : "";

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>${PREVIEW_STYLES}</style>
  </head>
  <body>
    <article>
      <header>
        <b style="font-size:24px;letter-spacing:2px">SIMPLEADS</b>
        <div>Better connections. New possibilities.</div>
      </header>
      <main>${personalize(body, user, { html: true })}${unsubscribe}</main>
      <footer>
        Simpleads by Renoweb &middot; Built to help you grow.<br>
        Need a hand? Reach us at renowebhq@gmail.com.
      </footer>
    </article>
  </body>
</html>`;
}
