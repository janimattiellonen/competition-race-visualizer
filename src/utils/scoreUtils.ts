export interface ScoreDisplay {
  text: string
  color: string
  scale: number
}

export function getScoreDisplay(diff: number, score: number): ScoreDisplay {
  // Hole-in-one
  if (score === 1) return { text: 'ACE!', color: '#ffd700', scale: 3 }

  if (diff <= -3) return { text: `${diff}`, color: '#006400', scale: 2.5 }
  if (diff === -2) return { text: '-2', color: '#00aa00', scale: 2 }
  if (diff === -1) return { text: '-1', color: '#88ff88', scale: 1.5 }
  if (diff === 0) return { text: 'E', color: '#888888', scale: 1 }
  if (diff === 1) return { text: '+1', color: '#ff8888', scale: 1.5 }
  if (diff === 2) return { text: '+2', color: '#ff0000', scale: 2 }
  if (diff === 3) return { text: '+3', color: '#cc44ff', scale: 2.5 }

  return { text: `+${diff}`, color: '#cc44ff', scale: 3 }
}
