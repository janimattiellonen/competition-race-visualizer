import { useState } from 'react'
import { motion } from 'framer-motion'

interface CompetitionFormProps {
  onSubmit: (competitionId: number) => void
  isLoading: boolean
  error: string | null
}

function parseMetrixId(input: string): number | null {
  const trimmed = input.trim()

  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10)
  }

  try {
    let url = trimmed
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    const parsed = new URL(url)
    if (parsed.hostname !== 'discgolfmetrix.com' && parsed.hostname !== 'www.discgolfmetrix.com') {
      return null
    }
    const pathMatch = parsed.pathname.match(/^\/(\d+)/)
    if (pathMatch) {
      return parseInt(pathMatch[1], 10)
    }
  } catch {
    // Not a valid URL
  }

  return null
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-tech)',
  fontWeight: 600,
  fontSize: '16px',
  padding: '12px 16px',
  background: 'rgba(6, 6, 18, 0.8)',
  color: 'var(--color-white)',
  border: '1px solid rgba(0, 136, 255, 0.4)',
  borderLeft: '3px solid var(--color-blue)',
  borderRadius: '2px',
  outline: 'none',
  width: '100%',
  boxShadow: 'inset 0 0 20px rgba(0, 136, 255, 0.05)',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  letterSpacing: '1px',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-tech)',
  fontWeight: 700,
  fontSize: '11px',
  color: 'var(--color-blue)',
  textShadow: '0 0 5px rgba(0, 136, 255, 0.3)',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  marginBottom: '8px',
  display: 'block',
}

export default function CompetitionForm({ onSubmit, isLoading, error }: CompetitionFormProps) {
  const [metrixInput, setMetrixInput] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError(null)

    if (!metrixInput.trim()) {
      setValidationError('Enter a Metrix competition URL or ID')
      return
    }

    const competitionId = parseMetrixId(metrixInput)
    if (competitionId === null) {
      setValidationError('Invalid input. Use a numeric ID or a discgolfmetrix.com URL')
      return
    }

    onSubmit(competitionId)
  }

  const displayError = validationError || error

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '480px',
        padding: '40px 24px',
        position: 'relative',
      }}
    >
      {/* Title block */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '32px' }}
      >
        <div style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '18px',
          color: 'var(--color-blue)',
          textShadow: 'var(--text-glow-blue)',
          letterSpacing: '4px',
          marginBottom: '8px',
        }}>
          VELOCITY
        </div>
        <div style={{
          fontFamily: 'var(--font-tech)',
          fontWeight: 700,
          fontSize: '13px',
          color: 'var(--color-magenta)',
          textShadow: '0 0 8px rgba(255, 0, 85, 0.4)',
          letterSpacing: '6px',
          textTransform: 'uppercase',
        }}>
          Race Visualizer
        </div>
        <div style={{
          width: '60px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--color-blue), transparent)',
          margin: '12px auto 0',
        }} />
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          padding: '28px',
          background: 'rgba(6, 6, 18, 0.6)',
          border: '1px solid rgba(0, 136, 255, 0.15)',
          borderRadius: '3px',
          boxShadow: '0 0 30px rgba(0, 136, 255, 0.05)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div>
          <label style={labelStyle}>Competition</label>
          <input
            type="text"
            value={metrixInput}
            onChange={(e) => {
              setMetrixInput(e.target.value)
              setValidationError(null)
            }}
            placeholder="Metrix ID or URL"
            disabled={isLoading}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-lime)'
              e.target.style.borderLeftColor = 'var(--color-lime)'
              e.target.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 136, 0.08), 0 0 10px rgba(0, 255, 136, 0.15)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 136, 255, 0.4)'
              e.target.style.borderLeftColor = 'var(--color-blue)'
              e.target.style.boxShadow = 'inset 0 0 20px rgba(0, 136, 255, 0.05)'
            }}
          />
        </div>

        {displayError && (
          <motion.p
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontFamily: 'var(--font-tech)',
              fontWeight: 600,
              fontSize: '12px',
              color: 'var(--color-red)',
              textShadow: '0 0 5px rgba(255, 34, 34, 0.3)',
              lineHeight: '1.5',
              paddingLeft: '8px',
              borderLeft: '2px solid var(--color-red)',
            }}
          >
            {displayError}
          </motion.p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.15)',
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '11px',
              padding: '14px 48px',
              background: isLoading
                ? 'rgba(0, 255, 136, 0.15)'
                : 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 136, 255, 0.2) 100%)',
              color: 'var(--color-lime)',
              border: '1px solid rgba(0, 255, 136, 0.5)',
              borderRadius: '2px',
              cursor: isLoading ? 'wait' : 'pointer',
              letterSpacing: '4px',
              boxShadow: '0 0 10px rgba(0, 255, 136, 0.15)',
              opacity: isLoading ? 0.6 : 1,
              textShadow: '0 0 8px rgba(0, 255, 136, 0.5)',
            }}
          >
            {isLoading ? 'LOADING...' : 'BEGIN'}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  )
}
