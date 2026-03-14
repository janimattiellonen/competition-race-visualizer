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
        marginBottom: 14,
        flexShrink: 0,
        paddingBottom: 8,
        borderBottom: '1px solid rgba(0, 136, 255, 0.12)',
      }}>
        <div style={{
          fontFamily: 'var(--font-tech)',
          fontWeight: 700,
          fontSize: '14px',
          color: 'var(--color-blue)',
          textShadow: '0 0 8px rgba(0, 136, 255, 0.3)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          {competition.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '9px',
          color: 'var(--color-amber)',
          textShadow: '0 0 5px rgba(255, 170, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{
            fontFamily: 'var(--font-tech)',
            fontWeight: 700,
            fontSize: '11px',
            color: 'var(--color-white)',
            opacity: 0.5,
          }}>
            HOLE
          </span>
          {currentHole}
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ opacity: 0.5 }}>{competition.totalHoles}</span>
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
            <div key={division.className} style={{ marginBottom: 14 }}>
              {/* Division header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 5,
                paddingLeft: 150,
              }}>
                <div style={{
                  width: 3,
                  height: 10,
                  background: 'var(--color-magenta)',
                  borderRadius: 1,
                  boxShadow: '0 0 4px rgba(255, 0, 85, 0.4)',
                }} />
                <span style={{
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 700,
                  fontSize: '11px',
                  color: 'var(--color-magenta)',
                  textShadow: '0 0 4px rgba(255, 0, 85, 0.25)',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                }}>
                  {division.className}
                </span>
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
