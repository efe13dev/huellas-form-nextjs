export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  const response = await fetch("/api/cloudinary", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  return data.url;
}
