interface PlayerDotProps {
  color: string
  positionPercent: number
}

export default function PlayerDot({ color, positionPercent }: PlayerDotProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: `${positionPercent}%`,
        transform: 'translate(-50%, -50%)',
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
        willChange: 'left',
        zIndex: 2,
      }}
    />
  )
}
