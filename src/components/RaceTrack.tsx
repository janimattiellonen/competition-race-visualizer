import { motion } from 'framer-motion'
import type { CompetitionData } from '../types/competition'
import type { DivisionPlaybackState } from '../hooks/useRacePlayback'
import PlayerRow from './PlayerRow'

interface RaceTrackProps {
  competition: CompetitionData
  currentHole: number
  divisions: DivisionPlaybackState[]
}

export default function RaceTrack({
  competition,
  currentHole,
  divisions,
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

      {/* Divisions */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: 4,
      }}>
        {competition.divisions.map((division, divIdx) => {
          const divState = divisions[divIdx]
          if (!divState) return null

          return (
            <div key={division.className} style={{ marginBottom: 12 }}>
              {/* Division header */}
              <div style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '8px',
                color: 'var(--color-yellow)',
                textShadow: '0 0 4px var(--color-yellow)',
                letterSpacing: '2px',
                marginBottom: 4,
                paddingLeft: 150,
                borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                paddingBottom: 3,
              }}>
                {division.className.toUpperCase()}
              </div>

              {/* Player rows */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}>
                {division.players.map((player, playerIdx) => (
                  <PlayerRow
                    key={player.id}
                    name={player.name}
                    color={player.color}
                    positionPercent={divState.playerPositions[playerIdx] ?? 0}
                    cumulativeDiff={divState.playerCumulativeDiffs[playerIdx] ?? 0}
                    totalStrokes={divState.playerTotalStrokes[playerIdx] ?? 0}
                    currentDiff={divState.currentDiffs ? divState.currentDiffs[playerIdx] : null}
                    currentScore={divState.currentDiffs && currentHole > 0 ? player.scores[currentHole - 1] : null}
                    currentHole={currentHole}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
