// # All outreach requests reuse the existing user session. Provider secrets never
// # enter localStorage; only the app JWT is read from the established auth store.
export async function outreachApi(path, data, method) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: method || (data === undefined ? "GET" : "POST"),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("renoweb_jwt") || ""}`,
      ...(data === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof payload.detail === "string"
        ? payload.detail
        : "Check the email fields and try again.",
    );
  }
  return payload;
}
