import { useState, useCallback } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import type { Phase, CompetitionData } from './types/competition'
import { fetchCompetitionFromMetrix } from './api/metrixClient'
import { assignPlayerColors } from './utils/colorUtils'
import CompetitionForm from './components/CompetitionForm'
import CountdownOverlay from './components/CountdownOverlay'
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
              <motion.div
                key="race"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-retro)',
                  fontSize: '14px',
                  color: 'var(--color-cyan)',
                  textShadow: 'var(--text-glow-cyan)',
                  textAlign: 'center',
                  lineHeight: '2.5',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '16px' }}>RACE</div>
                <div style={{ fontSize: '11px', color: 'var(--color-purple)' }}>
                  {competitionData.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-pink)' }}>
                  {competitionData.players.length} players / {competitionData.totalHoles} holes
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  )
}

export default App
