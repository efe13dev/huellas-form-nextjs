export async function deleteImageFromCloudinary(
  public_id: string | null
): Promise<void> {
  if (!public_id) {
    // eslint-disable-next-line
    console.log(
      'No se proporcionó public_id, saltando la eliminación en Cloudinary'
    );
    return;
  }

  const response = await fetch('/api/cloudinary', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ public_id })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error al eliminar la imagen: ${errorData.error || response.statusText}`
    );
  }
}
