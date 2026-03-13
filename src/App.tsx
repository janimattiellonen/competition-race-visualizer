import { useState, useCallback, useMemo } from 'react'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import type { Phase, CompetitionData } from './types/competition'
import { fetchCompetitionFromMetrix } from './api/metrixClient'
import { assignPlayerColors } from './utils/colorUtils'
import CompetitionForm from './components/CompetitionForm'
import CountdownOverlay from './components/CountdownOverlay'
import RaceTrack from './components/RaceTrack'
import './App.css'

function App() {
  const [phase, setPhase] = useState<Phase>('form')
  const [competitionData, setCompetitionData] = useState<CompetitionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (competitionId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCompetitionFromMetrix(competitionId)
      const colors = assignPlayerColors(data.players.length)
      data.players.forEach((player, i) => {
        player.color = colors[i]
      })
      setCompetitionData(data)
      setPhase('countdown')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load competition')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleCountdownComplete = useCallback(() => {
    setPhase('race')
  }, [])

  const playerCount = competitionData?.players.length ?? 0
  const initialPositions = useMemo(() => new Array(playerCount).fill(0), [playerCount])
  const initialDiffs = useMemo(() => new Array(playerCount).fill(0), [playerCount])
  const initialStrokes = useMemo(() => new Array(playerCount).fill(0), [playerCount])

  return (
    <div className="app">
      <div className="scanline" />
      <div className="app-content">
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {phase === 'form' && (
              <CompetitionForm
                key="form"
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />
            )}

            {phase === 'countdown' && (
              <CountdownOverlay key="countdown" onComplete={handleCountdownComplete} />
            )}

            {phase === 'race' && competitionData && (
              <RaceTrack
                key="race"
                competition={competitionData}
                currentHole={0}
                playerPositions={initialPositions}
                playerCumulativeDiffs={initialDiffs}
                playerTotalStrokes={initialStrokes}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  )
}

export default App
