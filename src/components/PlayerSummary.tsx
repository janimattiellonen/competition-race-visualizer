interface PlayerSummaryProps {
  cumulativeDiff: number
  totalStrokes: number
}

export default function PlayerSummary({ cumulativeDiff, totalStrokes }: PlayerSummaryProps) {
  const diffText = cumulativeDiff === 0 ? 'E' : cumulativeDiff > 0 ? `+${cumulativeDiff}` : `${cumulativeDiff}`
  const diffColor = cumulativeDiff < 0 ? '#00ff88' : cumulativeDiff > 0 ? '#ff4466' : '#667788'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      minWidth: 70,
      paddingLeft: 8,
    }}>
      <span style={{
        fontFamily: 'var(--font-retro)',
        fontSize: '8px',
        color: diffColor,
        textShadow: `0 0 4px ${diffColor}66`,
      }}>
        {diffText}
      </span>
      <span style={{
        fontFamily: 'var(--font-tech)',
        fontWeight: 600,
        fontSize: '10px',
        color: 'rgba(232, 234, 255, 0.3)',
        marginTop: 2,
      }}>
        {totalStrokes}
      </span>
    </div>
  )
}
