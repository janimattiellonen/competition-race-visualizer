import { useState, useEffect, useRef, useCallback } from 'react'
import type { CompetitionData } from '../types/competition'

const SPEED_MULTIPLIER = 0.2
const HOLE_DELAY = 600
const INITIAL_DELAY = 800

export interface RacePlaybackState {
  currentHole: number
  playerPositions: number[]
  playerCumulativeDiffs: number[]
  playerTotalStrokes: number[]
  currentDiffs: number[] | null
  isComplete: boolean
}

function computePositions(
  competition: CompetitionData,
  upToHole: number,
): { positions: number[]; cumulativeDiffs: number[]; totalStrokes: number[] } {
  const { players, totalHoles } = competition
  const baseIncrement = 100 / totalHoles

  const positions: number[] = []
  const cumulativeDiffs: number[] = []
  const totalStrokes: number[] = []

  for (const player of players) {
    let position = 0
    let cumDiff = 0
    let strokes = 0

    for (let h = 0; h < upToHole; h++) {
      const diff = player.diffs[h]
      cumDiff += diff
      strokes += player.scores[h]
      const speedBonus = -diff * baseIncrement * SPEED_MULTIPLIER
      position += baseIncrement + speedBonus
    }

    positions.push(Math.max(0, Math.min(100, position)))
    cumulativeDiffs.push(cumDiff)
    totalStrokes.push(strokes)
  }

  return { positions, cumulativeDiffs, totalStrokes }
}

export function useRacePlayback(
  competition: CompetitionData | null,
  active: boolean,
): RacePlaybackState & { skip: () => void } {
  const [currentHole, setCurrentHole] = useState(0)
  const [currentDiffs, setCurrentDiffs] = useState<number[] | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skippedRef = useRef(false)

  const totalHoles = competition?.totalHoles ?? 0

  // Reset when competition changes
  useEffect(() => {
    setCurrentHole(0)
    setCurrentDiffs(null)
    skippedRef.current = false
  }, [competition])

  // Advance hole by hole
  useEffect(() => {
    if (!active || !competition || skippedRef.current) return
    if (currentHole >= totalHoles) return

    const delay = currentHole === 0 ? INITIAL_DELAY : HOLE_DELAY

    timerRef.current = setTimeout(() => {
      const nextHole = currentHole + 1
      setCurrentHole(nextHole)

      // Show current diffs for this hole
      const diffs = competition.players.map(p => p.diffs[nextHole - 1])
      setCurrentDiffs(diffs)

      // Clear diffs after a brief display
      setTimeout(() => {
        setCurrentDiffs(null)
      }, HOLE_DELAY * 0.8)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, competition, currentHole, totalHoles])

  const skip = useCallback(() => {
    if (!competition) return
    skippedRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrentHole(totalHoles)
    setCurrentDiffs(null)
  }, [competition, totalHoles])

  const { positions, cumulativeDiffs, totalStrokes } = competition
    ? computePositions(competition, currentHole)
    : { positions: [], cumulativeDiffs: [], totalStrokes: [] }

  return {
    currentHole,
    playerPositions: positions,
    playerCumulativeDiffs: cumulativeDiffs,
    playerTotalStrokes: totalStrokes,
    currentDiffs,
    isComplete: currentHole >= totalHoles && totalHoles > 0,
    skip,
  }
}
