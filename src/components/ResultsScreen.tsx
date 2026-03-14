import { motion } from 'framer-motion'
import type { CompetitionData, DivisionData, PlayerData } from '../types/competition'

interface ResultsScreenProps {
  competition: CompetitionData
  onBack: () => void
}

function getDiffText(diffs: number[]): string {
  const total = diffs.reduce((sum, d) => sum + d, 0)
  if (total === 0) return 'E'
  return total > 0 ? `+${total}` : `${total}`
}

function getDiffColor(diffs: number[]): string {
  const total = diffs.reduce((sum, d) => sum + d, 0)
  if (total < 0) return '#00ff88'
  if (total > 0) return '#ff4466'
  return '#667788'
}

function getTotalStrokes(scores: number[]): number {
  return scores.reduce((sum, s) => sum + s, 0)
}

const podiumColors = ['var(--color-amber)', 'var(--color-blue)', 'var(--color-magenta)']
const podiumGlows = [
  'var(--text-glow-amber)',
  'var(--text-glow-blue)',
  'var(--text-glow-magenta)',
]
const podiumHeights = [90, 65, 50]
const podiumOrder = [1, 0, 2]

function DivisionPodium({ division, delayBase }: { division: DivisionData; delayBase: number }) {
  const top3 = division.players.slice(0, 3)
  const rest = division.players.slice(3)

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Division title */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delayBase, duration: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
          paddingBottom: 5,
          borderBottom: '1px solid rgba(255, 0, 85, 0.15)',
        }}
      >
        <div style={{
          width: 3,
          height: 12,
          background: 'var(--color-magenta)',
          borderRadius: 1,
        }} />
        <span style={{
          fontFamily: 'var(--font-tech)',
          fontWeight: 700,
          fontSize: '12px',
          color: 'var(--color-magenta)',
          textShadow: '0 0 4px rgba(255, 0, 85, 0.25)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          {division.className}
        </span>
      </motion.div>

      {/* Podium */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 12,
      }}>
        {podiumOrder.map((playerIdx, visualIdx) => {
          const player = top3[playerIdx]
          if (!player) return null
          const place = playerIdx + 1

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delayBase + 0.1 + visualIdx * 0.15, duration: 0.4, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div style={{
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                fontSize: '11px',
                color: podiumColors[playerIdx],
                textShadow: podiumGlows[playerIdx],
                maxWidth: 110,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}>
                {player.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '7px',
                color: getDiffColor(player.diffs),
                textShadow: `0 0 3px ${getDiffColor(player.diffs)}66`,
              }}>
                {getDiffText(player.diffs)} ({getTotalStrokes(player.scores)})
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: podiumHeights[playerIdx] }}
                transition={{ delay: delayBase + 0.3 + visualIdx * 0.15, duration: 0.5, ease: 'easeOut' }}
                style={{
                  width: 85,
                  background: `linear-gradient(180deg, ${podiumColors[playerIdx]}22 0%, ${podiumColors[playerIdx]}08 100%)`,
                  borderTop: `2px solid ${podiumColors[playerIdx]}88`,
                  borderLeft: `1px solid ${podiumColors[playerIdx]}33`,
                  borderRight: `1px solid ${podiumColors[playerIdx]}33`,
                  borderBottom: 'none',
                  borderRadius: '2px 2px 0 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: 8,
                  overflow: 'hidden',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-retro)',
                  fontSize: '16px',
                  color: podiumColors[playerIdx],
                  textShadow: podiumGlows[playerIdx],
                }}>
                  {place}
                </span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Rest of leaderboard */}
      {rest.map((player: PlayerData, index: number) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delayBase + 0.6 + index * 0.04, duration: 0.25 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            borderBottom: '1px solid rgba(0, 136, 255, 0.06)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-tech)',
            fontWeight: 600,
            fontSize: '10px',
            color: 'rgba(232, 234, 255, 0.3)',
            width: 25,
            textAlign: 'right',
            marginRight: 10,
          }}>
            {index + 4}
          </span>
          <span style={{
            fontFamily: 'var(--font-tech)',
            fontWeight: 700,
            fontSize: '11px',
            color: player.color,
            textShadow: `0 0 4px ${player.color}44`,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {player.name}
          </span>
          <span style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '7px',
            color: getDiffColor(player.diffs),
            textShadow: `0 0 3px ${getDiffColor(player.diffs)}44`,
            marginLeft: 8,
          }}>
            {getDiffText(player.diffs)}
          </span>
          <span style={{
            fontFamily: 'var(--font-tech)',
            fontWeight: 600,
            fontSize: '9px',
            color: 'rgba(232, 234, 255, 0.25)',
            marginLeft: 8,
            minWidth: 28,
            textAlign: 'right',
          }}>
            {getTotalStrokes(player.scores)}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export default function ResultsScreen({ competition, onBack }: ResultsScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 4 }}
      >
        <span style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '14px',
          color: 'var(--color-amber)',
          textShadow: 'var(--text-glow-amber)',
          letterSpacing: '4px',
        }}>
          FINAL RESULTS
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-tech)',
          fontWeight: 700,
          fontSize: '12px',
          color: 'var(--color-blue)',
          textShadow: '0 0 6px rgba(0, 136, 255, 0.3)',
          letterSpacing: '2px',
          marginBottom: 16,
          textTransform: 'uppercase',
        }}
      >
        {competition.name}
      </motion.div>

      {/* Divisions */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: 600,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {competition.divisions.map((division, divIdx) => (
          <DivisionPodium
            key={division.className}
            division={division}
            delayBase={0.4 + divIdx * 0.8}
          />
        ))}
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + competition.divisions.length * 0.8, duration: 0.4 }}
        onClick={onBack}
        whileHover={{
          scale: 1.03,
          boxShadow: '0 0 15px rgba(0, 136, 255, 0.3), 0 0 30px rgba(0, 136, 255, 0.15)',
        }}
        whileTap={{ scale: 0.97 }}
        style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '9px',
          padding: '10px 28px',
          marginTop: 12,
          background: 'rgba(0, 136, 255, 0.1)',
          color: 'var(--color-blue)',
          border: '1px solid rgba(0, 136, 255, 0.4)',
          borderRadius: '2px',
          cursor: 'pointer',
          letterSpacing: '3px',
          boxShadow: '0 0 8px rgba(0, 136, 255, 0.1)',
          flexShrink: 0,
          textShadow: '0 0 6px rgba(0, 136, 255, 0.3)',
        }}
      >
        NEW RACE
      </motion.button>
    </motion.div>
  )
}
