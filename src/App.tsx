import { useState, useCallback } from 'react'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import type { Phase } from './types/competition'
import CompetitionForm from './components/CompetitionForm'
import './App.css'

function App() {
  const [phase, setPhase] = useState<Phase>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (competitionId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Step 3 - fetch competition data
      console.log('Competition ID:', competitionId)
      // Simulate loading for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPhase('countdown')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load competition')
    } finally {
      setIsLoading(false)
    }
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
              <div key="countdown" style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '24px',
                color: 'var(--color-cyan)',
                textShadow: 'var(--text-glow-cyan)',
              }}>
                COUNTDOWN PLACEHOLDER
              </div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  )
}

export default App
