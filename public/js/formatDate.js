export function formatDate(dateString) {
  const date = new Date(dateString);

  if (!(date instanceof Date)) {
    throw new Error("Invalid date");
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
