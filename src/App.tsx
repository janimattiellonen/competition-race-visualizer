import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import type { Phase, CompetitionData } from './types/competition'
import { fetchCompetitionFromMetrix } from './api/metrixClient'
import { assignDivisionColors } from './utils/colorUtils'
import { useRacePlayback } from './hooks/useRacePlayback'
import CompetitionForm from './components/CompetitionForm'
import CountdownOverlay from './components/CountdownOverlay'
import RaceTrack from './components/RaceTrack'
import ResultsScreen from './components/ResultsScreen'
import './App.css'

function App() {
  const [phase, setPhase] = useState<Phase>('form')
  const [competitionData, setCompetitionData] = useState<CompetitionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const playback = useRacePlayback(competitionData, phase === 'race')

  // Transition to results when race completes
  useEffect(() => {
    if (playback.isComplete && phase === 'race') {
      const timer = setTimeout(() => {
        setPhase('results')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [playback.isComplete, phase])

  const handleSubmit = useCallback(async (competitionId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCompetitionFromMetrix(competitionId)
      assignDivisionColors(data.divisions)
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

  const handleBack = useCallback(() => {
    setPhase('form')
    setCompetitionData(null)
  }, [])

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
                currentHole={playback.currentHole}
                divisions={playback.divisions}
              />
            )}

            {phase === 'results' && competitionData && (
              <ResultsScreen
                key="results"
                competition={competitionData}
                onBack={handleBack}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  )
}

export default App
