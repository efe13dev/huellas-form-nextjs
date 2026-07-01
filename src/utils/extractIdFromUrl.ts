export default function extractIdFromUrl(url: string): string {
  return url?.split("/").pop()?.split(".")[0] ?? "";
}
