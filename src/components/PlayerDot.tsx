interface PlayerDotProps {
  color: string
  positionPercent: number
}

export default function PlayerDot({ color, positionPercent }: PlayerDotProps) {
  return (
    <>
      {/* Motion trail */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${positionPercent}%`,
          transform: 'translate(-100%, -50%)',
          width: 20,
          height: 4,
          background: `linear-gradient(to left, ${color}88, transparent)`,
          borderRadius: 2,
          zIndex: 1,
        }}
      />
      {/* Dot */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${positionPercent}%`,
          transform: 'translate(-50%, -50%) rotate(45deg)',
          width: 10,
          height: 10,
          borderRadius: '2px',
          background: color,
          boxShadow: `0 0 6px ${color}, 0 0 14px ${color}66`,
          willChange: 'left',
          zIndex: 2,
        }}
      />
    </>
  )
}
