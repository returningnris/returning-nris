type Detector = { detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]> }
type DetectorConstructor = new (options: { formats: string[] }) => Detector

// Loaded only when an organiser starts the camera. Frames remain on the device.
export function createHalloweenQrReader() {
  const API = (window as unknown as { BarcodeDetector?: DetectorConstructor }).BarcodeDetector
  let native: Detector | null = null
  try { if (API) native = new API({ formats: ['qr_code'] }) } catch { /* Use the portable decoder. */ }
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  let decoder: Promise<typeof import('jsqr')['default']> | null = null
  return async (video: HTMLVideoElement): Promise<string | null> => {
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return null
    if (native) {
      try { return (await native.detect(video))[0]?.rawValue || null }
      catch { native = null }
    }
    if (!context) throw new Error('Camera frames could not be read. Enter the ticket identifier instead.')
    decoder ||= import('jsqr').then(module => module.default)
    const decode = await decoder
    const scale = Math.min(720 / video.videoWidth, 540 / video.videoHeight, 1)
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const frame = context.getImageData(0, 0, canvas.width, canvas.height)
    return decode(frame.data, frame.width, frame.height, { inversionAttempts: 'dontInvert' })?.data || null
  }
}
