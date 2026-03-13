import PlayerDot from './PlayerDot'
import PlayerSummary from './PlayerSummary'

interface PlayerRowProps {
  name: string
  color: string
  positionPercent: number
  cumulativeDiff: number
  totalStrokes: number
}

export default function PlayerRow({ name, color, positionPercent, cumulativeDiff, totalStrokes }: PlayerRowProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: 28,
      gap: 0,
    }}>
      {/* Player name */}
      <div style={{
        width: 150,
        minWidth: 150,
        paddingRight: 10,
        fontFamily: 'var(--font-tech)',
        fontSize: '10px',
        color: color,
        textShadow: `0 0 4px ${color}`,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'right',
      }}>
        {name}
      </div>

      {/* Track */}
      <div style={{
        flex: 1,
        position: 'relative',
        height: '100%',
      }}>
        {/* Track line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 1,
          background: 'rgba(176, 38, 255, 0.2)',
          transform: 'translateY(-50%)',
        }} />

        {/* Player dot */}
        <PlayerDot color={color} positionPercent={positionPercent} />
      </div>

      {/* Summary */}
      <PlayerSummary cumulativeDiff={cumulativeDiff} totalStrokes={totalStrokes} />
    </div>
  )
}
