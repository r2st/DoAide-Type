import { useCallback, useRef } from 'react'

export function useSound(enabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }, [])

  const playKeyPress = useCallback(() => {
    if (!enabled) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime)
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.05)
    } catch { /* ignore audio errors */ }
  }, [enabled, getCtx])

  const playError = useCallback(() => {
    if (!enabled) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.type = 'square'
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.08)
    } catch { /* ignore audio errors */ }
  }, [enabled, getCtx])

  const playFinish = useCallback(() => {
    if (!enabled) return
    try {
      const ctx = getCtx()
      const notes = [523.25, 659.25, 783.99]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2)
        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + i * 0.1 + 0.2)
      })
    } catch { /* ignore audio errors */ }
  }, [enabled, getCtx])

  return { playKeyPress, playError, playFinish }
}
