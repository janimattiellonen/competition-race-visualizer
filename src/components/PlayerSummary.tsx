interface PlayerSummaryProps {
  cumulativeDiff: number
  totalStrokes: number
}

export default function PlayerSummary({ cumulativeDiff, totalStrokes }: PlayerSummaryProps) {
  const diffText = cumulativeDiff === 0 ? 'E' : cumulativeDiff > 0 ? `+${cumulativeDiff}` : `${cumulativeDiff}`
  const diffColor = cumulativeDiff < 0 ? '#88ff88' : cumulativeDiff > 0 ? '#ff8888' : '#888888'

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
        fontSize: '9px',
        color: diffColor,
        textShadow: `0 0 4px ${diffColor}`,
      }}>
        {diffText}
      </span>
      <span style={{
        fontFamily: 'var(--font-tech)',
        fontSize: '9px',
        color: 'rgba(240, 230, 255, 0.4)',
        marginTop: 2,
      }}>
        {totalStrokes}
      </span>
    </div>
  )
}
