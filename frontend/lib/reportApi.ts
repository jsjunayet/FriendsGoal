const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function downloadReportFile(
  endpointUrl: string,
  type: "pdf" | "excel",
  defaultFilename: string
): Promise<void> {
  // Fix relative URLs by prefixing them with API_BASE_URL (avoiding double slashes)
  let fullUrl = endpointUrl;
  if (fullUrl.startsWith("/api/v1")) {
    fullUrl = `${API_BASE_URL}${fullUrl.replace("/api/v1", "")}`;
  } else if (fullUrl.startsWith("/")) {
    fullUrl = `${API_BASE_URL}${fullUrl}`;
  }

  const url = `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}format=${type}`;
  const ext = type === "pdf" ? "pdf" : "xlsx";
  const finalFilename = `${defaultFilename}.${ext}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Export failed with status ${res.status}`);

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
