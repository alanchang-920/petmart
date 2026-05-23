// Extract a user-friendly message from an axios error.
// FastAPI returns either `{detail: "..."}` (string) or
// `{detail: [{msg, loc, ...}]}` (Pydantic validation errors).
export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((issue) => issue?.msg || JSON.stringify(issue))
      .join("; ");
  }

  return error?.message || fallback;
}
