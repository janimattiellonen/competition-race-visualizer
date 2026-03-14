import { useState, useEffect, useRef, useCallback } from 'react'
import type { CompetitionData, PlayerData } from '../types/competition'

const SPEED_MULTIPLIER = 0.2
const INITIAL_DELAY = 800
const SCORE_DISPLAY_MS = 400
// How many holes per second the race advances
const HOLES_PER_SECOND = 2

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

function computePlayerPositionAtHole(
  player: PlayerData,
  totalHoles: number,
  hole: number,
): number {
  const baseIncrement = 100 / totalHoles
  let position = 0

  for (let h = 0; h < hole; h++) {
    const diff = player.diffs[h]
    const speedBonus = -diff * baseIncrement * SPEED_MULTIPLIER
    position += baseIncrement + speedBonus
  }

  return position
}

function computePlayerPositionSmooth(
  player: PlayerData,
  totalHoles: number,
  progress: number,
): number {
  const currentHole = Math.floor(progress)
  const fraction = progress - currentHole

  const posAtCurrent = computePlayerPositionAtHole(player, totalHoles, currentHole)

  if (fraction === 0 || currentHole >= totalHoles) {
    return Math.max(0, Math.min(100, posAtCurrent))
  }

  const posAtNext = computePlayerPositionAtHole(player, totalHoles, Math.min(currentHole + 1, totalHoles))
  const interpolated = posAtCurrent + (posAtNext - posAtCurrent) * fraction

  return Math.max(0, Math.min(100, interpolated))
}

function computeDivisionState(
  players: PlayerData[],
  totalHoles: number,
  progress: number,
): { positions: number[]; cumulativeDiffs: number[]; totalStrokes: number[] } {
  const completedHole = Math.floor(progress)

  const positions: number[] = []
  const cumulativeDiffs: number[] = []
  const totalStrokes: number[] = []

  for (const player of players) {
    positions.push(computePlayerPositionSmooth(player, totalHoles, progress))

    let cumDiff = 0
    let strokes = 0
    for (let h = 0; h < completedHole; h++) {
      cumDiff += player.diffs[h]
      strokes += player.scores[h]
    }
    cumulativeDiffs.push(cumDiff)
    totalStrokes.push(strokes)
  }

  return { positions, cumulativeDiffs, totalStrokes }
}

export function useRacePlayback(
  competition: CompetitionData | null,
  active: boolean,
): RacePlaybackState & { skip: () => void } {
  const [progress, setProgress] = useState(0)
  const [currentDiffsMap, setCurrentDiffsMap] = useState<(number[] | null)[]>([])
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const skippedRef = useRef(false)
  const lastHoleRef = useRef(0)
  const scoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalHoles = competition?.totalHoles ?? 0
  const divisionCount = competition?.divisions.length ?? 0

  // Reset when competition changes
  useEffect(() => {
    setProgress(0)
    setCurrentDiffsMap([])
    skippedRef.current = false
    lastHoleRef.current = 0
    startTimeRef.current = null
  }, [competition])

  // Continuous animation loop
  useEffect(() => {
    if (!active || !competition || skippedRef.current || totalHoles === 0) return

    const animate = (timestamp: number) => {
      if (skippedRef.current) return

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000
      const newProgress = Math.min(elapsed * HOLES_PER_SECOND, totalHoles)

      setProgress(newProgress)

      // Detect when we cross a new hole boundary for floating scores
      const newHole = Math.floor(newProgress)
      if (newHole > lastHoleRef.current && newHole <= totalHoles) {
        lastHoleRef.current = newHole

        const diffs = competition.divisions.map(div =>
          div.players.map(p => p.diffs[newHole - 1])
        )
        setCurrentDiffsMap(diffs)

        if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current)
        scoreTimerRef.current = setTimeout(() => {
          setCurrentDiffsMap(competition.divisions.map(() => null))
        }, SCORE_DISPLAY_MS)
      }

      if (newProgress < totalHoles) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    // Initial delay before starting animation
    initialTimerRef.current = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate)
    }, INITIAL_DELAY)

    return () => {
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current)
    }
  }, [active, competition, totalHoles])

  const skip = useCallback(() => {
    if (!competition) return
    skippedRef.current = true
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current)
    lastHoleRef.current = totalHoles
    setProgress(totalHoles)
    setCurrentDiffsMap(competition.divisions.map(() => null))
  }, [competition, totalHoles])

  const currentHole = Math.floor(progress)

  const divisions: DivisionPlaybackState[] = competition
    ? competition.divisions.map((div, divIdx) => {
        const { positions, cumulativeDiffs, totalStrokes } = computeDivisionState(
          div.players,
          totalHoles,
          progress,
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
    isComplete: progress >= totalHoles && totalHoles > 0,
    skip,
  }
}
