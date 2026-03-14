import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CountdownOverlayProps {
  onComplete: () => void
}

const countdownStyles = [
  { color: 'var(--color-blue)', glow: 'var(--text-glow-blue)' },
  { color: 'var(--color-amber)', glow: 'var(--text-glow-amber)' },
  { color: 'var(--color-magenta)', glow: 'var(--text-glow-magenta)' },
]

export default function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count === 0) {
      const timer = setTimeout(onComplete, 400)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setCount(c => c - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, onComplete])

  const style = countdownStyles[3 - count] ?? countdownStyles[0]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6, 6, 18, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ rotateX: 90, opacity: 0, scale: 0.8 }}
            animate={{ rotateX: 0, opacity: 1, scale: 1 }}
            exit={{ rotateX: -90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '140px',
              color: style.color,
              textShadow: style.glow,
              perspective: '500px',
            }}
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
