/**
 * Crops the image to a centered square and resizes it to `size` px, returning a JPEG.
 * Re-encoding in the browser also drops EXIF metadata (e.g. GPS) before upload.
 */
export async function squarePhoto(file: File, size = 512): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type) && !/\.(jpe?g|png|webp|heic)$/i.test(file.name)) {
    throw new Error('Escolha um arquivo de foto (JPG ou PNG).')
  }
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('Não conseguimos abrir esta foto. Tente outra, em JPG ou PNG.')
  }
  const side = Math.min(bitmap.width, bitmap.height)
  const sx = (bitmap.width - side) / 2
  const sy = (bitmap.height - side) / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Seu navegador não conseguiu preparar a foto.')
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Não conseguimos preparar a foto.'))), 'image/jpeg', 0.88)
  )
}
