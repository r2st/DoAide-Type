import { useCallback, useEffect, useRef, useState } from 'react'
import type { Difficulty, TestMode, TestResult, TimeDuration, WpmDataPoint } from '../types'
import { generateCode, generateCodeMulti } from '../data/codeSnippets'
import { generateNumbers } from '../data/numbers'
import { generateSentences } from '../data/sentences'
import { generateWords } from '../data/words'

interface TypingTestState {
  text: string
  typed: string
  status: 'idle' | 'running' | 'finished'
  timeLeft: number
  wpmHistory: WpmDataPoint[]
  currentWpm: number
  currentAccuracy: number
  errors: Set<number>
  correctCount: number
  incorrectCount: number
}

export function useTypingTest(
  mode: TestMode,
  difficulty: Difficulty,
  duration: TimeDuration,
  customText: string,
) {
  const [state, setState] = useState<TypingTestState>({
    text: '',
    typed: '',
    status: 'idle',
    timeLeft: duration,
    wpmHistory: [],
    currentWpm: 0,
    currentAccuracy: 100,
    errors: new Set(),
    correctCount: 0,
    incorrectCount: 0,
  })

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const generateText = useCallback(() => {
    const wordCount = Math.ceil(duration * 3)
    switch (mode) {
      case 'words':
        return generateWords(wordCount, difficulty)
      case 'sentences':
        return generateSentences(Math.ceil(duration / 8))
      case 'code':
        return duration <= 30 ? generateCode() : generateCodeMulti(3)
      case 'numbers':
        return generateNumbers(wordCount)
      case 'custom':
        return customText || 'Please paste your custom text to begin typing.'
    }
  }, [mode, difficulty, duration, customText])

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current)
    timerRef.current = null
    wpmIntervalRef.current = null

    const newText = generateText()
    setState({
      text: newText,
      typed: '',
      status: 'idle',
      timeLeft: duration,
      wpmHistory: [],
      currentWpm: 0,
      currentAccuracy: 100,
      errors: new Set(),
      correctCount: 0,
      incorrectCount: 0,
    })
  }, [generateText, duration])

  useEffect(() => {
    reset()
  }, [reset])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current)
    }
  }, [])

  const startTest = useCallback(() => {
    startTimeRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setState(prev => {
        const newTimeLeft = prev.timeLeft - 1
        if (newTimeLeft <= 0) {
          if (timerRef.current) clearInterval(timerRef.current)
          if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current)
          timerRef.current = null
          wpmIntervalRef.current = null
          return { ...prev, timeLeft: 0, status: 'finished' }
        }
        return { ...prev, timeLeft: newTimeLeft }
      })
    }, 1000)

    wpmIntervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.status !== 'running') return prev
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60
        if (elapsed <= 0) return prev
        const rawWpm = Math.round((prev.typed.length / 5) / elapsed)
        const netWpm = Math.max(0, Math.round(((prev.typed.length - prev.incorrectCount) / 5) / elapsed))
        const point: WpmDataPoint = {
          time: Math.round((Date.now() - startTimeRef.current) / 1000),
          wpm: netWpm,
          raw: rawWpm,
        }
        return {
          ...prev,
          wpmHistory: [...prev.wpmHistory, point],
          currentWpm: netWpm,
        }
      })
    }, 1000)

    setState(prev => ({ ...prev, status: 'running' }))
  }, [])

  const handleInput = useCallback((newTyped: string) => {
    setState(prev => {
      if (prev.status === 'finished') return prev

      if (prev.status === 'idle' && newTyped.length > 0) {
        startTest()
      }

      let correct = 0
      let incorrect = 0
      const newErrors = new Set<number>()

      for (let i = 0; i < newTyped.length; i++) {
        if (i < prev.text.length) {
          if (newTyped[i] === prev.text[i]) {
            correct++
          } else {
            incorrect++
            newErrors.add(i)
          }
        }
      }

      const total = correct + incorrect
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100

      if (newTyped.length >= prev.text.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current)
        timerRef.current = null
        wpmIntervalRef.current = null

        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60
        const finalWpm = elapsed > 0 ? Math.max(0, Math.round(((newTyped.length - incorrect) / 5) / elapsed)) : 0

        return {
          ...prev,
          typed: newTyped,
          status: 'finished',
          errors: newErrors,
          correctCount: correct,
          incorrectCount: incorrect,
          currentAccuracy: accuracy,
          currentWpm: finalWpm,
        }
      }

      return {
        ...prev,
        typed: newTyped,
        status: prev.status === 'idle' ? 'running' : prev.status,
        errors: newErrors,
        correctCount: correct,
        incorrectCount: incorrect,
        currentAccuracy: accuracy,
      }
    })
  }, [startTest])

  const getResult = useCallback((): TestResult | null => {
    if (state.status !== 'finished') return null

    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60
    const rawWpm = elapsed > 0 ? Math.round((state.typed.length / 5) / elapsed) : 0
    const netWpm = elapsed > 0
      ? Math.max(0, Math.round(((state.typed.length - state.incorrectCount) / 5) / elapsed))
      : 0

    const errorKeys: Record<string, number> = {}
    state.errors.forEach(i => {
      if (i < state.text.length) {
        const key = state.text[i]
        errorKeys[key] = (errorKeys[key] || 0) + 1
      }
    })

    return {
      id: crypto.randomUUID(),
      wpm: netWpm,
      rawWpm,
      accuracy: state.currentAccuracy,
      correctChars: state.correctCount,
      incorrectChars: state.incorrectCount,
      totalChars: state.typed.length,
      mode,
      difficulty,
      duration,
      timestamp: Date.now(),
      wpmOverTime: state.wpmHistory,
      errorKeys,
    }
  }, [state, mode, difficulty, duration])

  return {
    text: state.text,
    typed: state.typed,
    status: state.status,
    timeLeft: state.timeLeft,
    wpmHistory: state.wpmHistory,
    currentWpm: state.currentWpm,
    currentAccuracy: state.currentAccuracy,
    errors: state.errors,
    correctCount: state.correctCount,
    incorrectCount: state.incorrectCount,
    handleInput,
    reset,
    getResult,
  }
}
