import { motion } from 'framer-motion'
import type { CompetitionData } from '../types/competition'
import PlayerRow from './PlayerRow'

interface RaceTrackProps {
  competition: CompetitionData
  currentHole: number
  playerPositions: number[]
  playerCumulativeDiffs: number[]
  playerTotalStrokes: number[]
}

export default function RaceTrack({
  competition,
  currentHole,
  playerPositions,
  playerCumulativeDiffs,
  playerTotalStrokes,
}: RaceTrackProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '10px',
          color: 'var(--color-cyan)',
          textShadow: 'var(--text-glow-cyan)',
          letterSpacing: '2px',
        }}>
          {competition.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '9px',
          color: 'var(--color-pink)',
          textShadow: '0 0 5px var(--color-pink)',
        }}>
          HOLE {currentHole} / {competition.totalHoles}
        </div>
      </div>

      {/* Player rows */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingRight: 4,
      }}>
        {competition.players.map((player, index) => (
          <PlayerRow
            key={player.id}
            name={player.name}
            color={player.color}
            positionPercent={playerPositions[index] ?? 0}
            cumulativeDiff={playerCumulativeDiffs[index] ?? 0}
            totalStrokes={playerTotalStrokes[index] ?? 0}
          />
        ))}
      </div>
    </motion.div>
  )
}
