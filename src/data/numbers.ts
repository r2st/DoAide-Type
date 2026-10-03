export function generateNumbers(count: number): string {
  const parts: string[] = []
  for (let i = 0; i < count; i++) {
    const type = Math.random()
    if (type < 0.3) {
      parts.push(String(Math.floor(Math.random() * 1000)))
    } else if (type < 0.5) {
      parts.push((Math.random() * 100).toFixed(2))
    } else if (type < 0.7) {
      const a = Math.floor(Math.random() * 100)
      const b = Math.floor(Math.random() * 100)
      const ops = ['+', '-', '*', '/']
      parts.push(`${a} ${ops[Math.floor(Math.random() * ops.length)]} ${b}`)
    } else if (type < 0.85) {
      parts.push(
        Array.from({ length: 3 + Math.floor(Math.random() * 5) }, () =>
          Math.floor(Math.random() * 10)
        ).join('')
      )
    } else {
      const phone = `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
      parts.push(phone)
    }
  }
  return parts.join(' ')
}
