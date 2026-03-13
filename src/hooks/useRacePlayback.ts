import { useState, useEffect, useRef, useCallback } from 'react'
import type { CompetitionData, PlayerData } from '../types/competition'

const SPEED_MULTIPLIER = 0.2
const HOLE_DELAY = 600
const INITIAL_DELAY = 800

export interface DivisionPlaybackState {
  playerPositions: number[]
  playerCumulativeDiffs: number[]
  playerTotalStrokes: number[]
  currentDiffs: number[] | null
}

export interface RacePlaybackState {
  currentHole: number
  divisions: DivisionPlaybackState[]
  isComplete: boolean
}

function computePlayerPositions(
  players: PlayerData[],
  totalHoles: number,
  upToHole: number,
): { positions: number[]; cumulativeDiffs: number[]; totalStrokes: number[] } {
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
  const [currentDiffsMap, setCurrentDiffsMap] = useState<(number[] | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skippedRef = useRef(false)

  const totalHoles = competition?.totalHoles ?? 0
  const divisionCount = competition?.divisions.length ?? 0

  // Reset when competition changes
  useEffect(() => {
    setCurrentHole(0)
    setCurrentDiffsMap([])
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

      // Show current diffs for each division
      const diffs = competition.divisions.map(div =>
        div.players.map(p => p.diffs[nextHole - 1])
      )
      setCurrentDiffsMap(diffs)

      // Clear diffs after a brief display
      setTimeout(() => {
        setCurrentDiffsMap(competition.divisions.map(() => null))
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
    setCurrentDiffsMap(competition.divisions.map(() => null))
  }, [competition, totalHoles])

  const divisions: DivisionPlaybackState[] = competition
    ? competition.divisions.map((div, divIdx) => {
        const { positions, cumulativeDiffs, totalStrokes } = computePlayerPositions(
          div.players,
          totalHoles,
          currentHole,
        )
        return {
          playerPositions: positions,
          playerCumulativeDiffs: cumulativeDiffs,
          playerTotalStrokes: totalStrokes,
          currentDiffs: divIdx < currentDiffsMap.length ? currentDiffsMap[divIdx] : null,
        }
      })
    : Array.from({ length: divisionCount }, () => ({
        playerPositions: [],
        playerCumulativeDiffs: [],
        playerTotalStrokes: [],
        currentDiffs: null,
      }))

  return {
    currentHole,
    divisions,
    isComplete: currentHole >= totalHoles && totalHoles > 0,
    skip,
  }
}
