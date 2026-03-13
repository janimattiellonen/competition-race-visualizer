import { motion } from 'framer-motion'

interface PlayerDotProps {
  color: string
  positionPercent: number
}

export default function PlayerDot({ color, positionPercent }: PlayerDotProps) {
  return (
    <motion.div
      animate={{ left: `${positionPercent}%` }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
        willChange: 'transform',
        zIndex: 2,
      }}
    />
  )
}
