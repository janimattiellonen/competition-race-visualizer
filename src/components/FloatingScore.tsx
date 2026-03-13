import { motion } from 'framer-motion'
import { getScoreDisplay } from '../utils/scoreUtils'

interface FloatingScoreProps {
  diff: number
  score: number
}

export default function FloatingScore({ diff, score }: FloatingScoreProps) {
  const { text, color, scale } = getScoreDisplay(diff, score)
  const fontSize = 8 * scale

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.3 }}
      animate={{ opacity: 1, y: -18, scale: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-retro)',
        fontSize: `${fontSize}px`,
        color,
        textShadow: `0 0 4px ${color}, 0 0 8px ${color}`,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {text}
    </motion.div>
  )
}
