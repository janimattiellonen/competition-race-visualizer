const NEON_PALETTE = [
  '#ff2d95', // pink
  '#00f0ff', // cyan
  '#ffd700', // gold
  '#39ff14', // neon green
  '#ff6b35', // orange
  '#b026ff', // purple
  '#ff073a', // red
  '#00ff88', // mint
  '#ff00ff', // magenta
  '#4deeea', // teal
  '#ffe66d', // light yellow
  '#ff1493', // deep pink
  '#7fff00', // chartreuse
  '#ff4500', // orange red
  '#00bfff', // deep sky blue
  '#ff69b4', // hot pink
  '#adff2f', // green yellow
  '#da70d6', // orchid
  '#ffa07a', // light salmon
  '#40e0d0', // turquoise
  '#ee82ee', // violet
  '#f0e68c', // khaki
  '#87ceeb', // sky blue
  '#dda0dd', // plum
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function assignPlayerColors(count: number): string[] {
  const shuffled = shuffleArray(NEON_PALETTE)
  const colors: string[] = []

  for (let i = 0; i < count; i++) {
    colors.push(shuffled[i % shuffled.length])
  }

  return colors
}
