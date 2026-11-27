/**
 * Crops the image to a centered square and resizes it to `size` px, returning a JPEG.
 * Re-encoding in the browser also drops EXIF metadata (e.g. GPS) before upload.
 */
export async function squarePhoto(file: File, size = 512): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type) && !/\.(jpe?g|png|webp|heic)$/i.test(file.name)) {
    throw new Error('Escolha um arquivo de foto (JPG ou PNG).')
  }
  const source = await decodeImage(file)
  const side = Math.min(source.width, source.height)
  const sx = (source.width - side) / 2
  const sy = (source.height - side) / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Seu navegador não conseguiu preparar a foto.')
  ctx.drawImage(source.image, sx, sy, side, side, 0, 0, size, size)
  source.release()
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Não conseguimos preparar a foto.'))), 'image/jpeg', 0.88)
  )
}

type Decoded = { image: CanvasImageSource; width: number; height: number; release: () => void }

/**
 * Decodes a photo with createImageBitmap (EXIF orientation aware) and falls back to <img>,
 * which covers Safari quirks and HEIC photos on Apple devices.
 */
async function decodeImage(file: File): Promise<Decoded> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { image: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() }
  } catch {
    // fall through to <img>
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    await img.decode()
    return { image: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) }
  } catch {
    URL.revokeObjectURL(url)
    throw new Error('Não conseguimos abrir esta foto. Se ela veio de um iPhone, tente enviar pelo Safari ou escolha uma foto em JPG.')
  }
}
