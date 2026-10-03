import { toPng } from 'html-to-image'

export async function captureResultCard(element: HTMLElement): Promise<string> {
  return toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#1a1a2e',
  })
}

export async function downloadResultImage(element: HTMLElement): Promise<void> {
  const dataUrl = await captureResultCard(element)
  const link = document.createElement('a')
  link.download = 'doaide-type-result.png'
  link.href = dataUrl
  link.click()
}

export function shareToTwitter(wpm: number, accuracy: number): void {
  const text = encodeURIComponent(
    `I just scored ${wpm} WPM with ${accuracy}% accuracy on DoAide Type! Can you beat me? 🎯⌨️\n\nTry it: type.doaide.com`
  )
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
}

export function shareToWhatsApp(wpm: number, accuracy: number): void {
  const text = encodeURIComponent(
    `I just scored ${wpm} WPM with ${accuracy}% accuracy on DoAide Type! Can you beat me? 🎯⌨️\n\nTry it: type.doaide.com`
  )
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

export function copyShareLink(wpm: number): void {
  const text = `I scored ${wpm} WPM on DoAide Type! Try it: type.doaide.com`
  navigator.clipboard.writeText(text)
}

export function generateChallengeLink(): string {
  return 'https://type.doaide.com'
}
