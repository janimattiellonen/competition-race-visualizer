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
  if (total < 0) return '#88ff88'
  if (total > 0) return '#ff8888'
  return '#888888'
}

function getTotalStrokes(scores: number[]): number {
  return scores.reduce((sum, s) => sum + s, 0)
}

const podiumColors = ['var(--color-yellow)', 'var(--color-cyan)', 'var(--color-pink)']
const podiumGlows = [
  'var(--text-glow-yellow)',
  'var(--text-glow-cyan)',
  'var(--text-glow-pink)',
]
const podiumHeights = [90, 65, 50]
const podiumOrder = [1, 0, 2] // 2nd, 1st, 3rd

function DivisionPodium({ division, delayBase }: { division: DivisionData; delayBase: number }) {
  const top3 = division.players.slice(0, 3)
  const rest = division.players.slice(3)

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Division title */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delayBase, duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '9px',
          color: 'var(--color-yellow)',
          textShadow: '0 0 4px var(--color-yellow)',
          letterSpacing: '2px',
          marginBottom: 12,
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
          paddingBottom: 4,
        }}
      >
        {division.className.toUpperCase()}
      </motion.div>

      {/* Podium */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 10,
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
                fontSize: '9px',
                color: podiumColors[playerIdx],
                textShadow: podiumGlows[playerIdx],
                maxWidth: 100,
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
                textShadow: `0 0 3px ${getDiffColor(player.diffs)}`,
              }}>
                {getDiffText(player.diffs)} ({getTotalStrokes(player.scores)})
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: podiumHeights[playerIdx] }}
                transition={{ delay: delayBase + 0.3 + visualIdx * 0.15, duration: 0.5, ease: 'easeOut' }}
                style={{
                  width: 80,
                  background: `linear-gradient(180deg, ${podiumColors[playerIdx]}33 0%, ${podiumColors[playerIdx]}11 100%)`,
                  border: `1px solid ${podiumColors[playerIdx]}66`,
                  borderBottom: 'none',
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: 6,
                  overflow: 'hidden',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-retro)',
                  fontSize: '14px',
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
            padding: '3px 8px',
            borderBottom: '1px solid rgba(176, 38, 255, 0.1)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '7px',
            color: 'rgba(240, 230, 255, 0.4)',
            width: 25,
            textAlign: 'right',
            marginRight: 8,
          }}>
            {index + 4}
          </span>
          <span style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '9px',
            color: player.color,
            textShadow: `0 0 3px ${player.color}`,
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
            textShadow: `0 0 3px ${getDiffColor(player.diffs)}`,
            marginLeft: 8,
          }}>
            {getDiffText(player.diffs)}
          </span>
          <span style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '7px',
            color: 'rgba(240, 230, 255, 0.3)',
            marginLeft: 8,
            minWidth: 25,
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
        style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '14px',
          color: 'var(--color-yellow)',
          textShadow: 'var(--text-glow-yellow)',
          letterSpacing: '4px',
          marginBottom: 4,
        }}
      >
        RESULTS
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-tech)',
          fontSize: '10px',
          color: 'var(--color-purple)',
          textShadow: '0 0 5px var(--color-purple)',
          letterSpacing: '2px',
          marginBottom: 16,
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
          scale: 1.05,
          boxShadow: '0 0 12px var(--color-purple), 0 0 24px var(--color-purple)',
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '9px',
          padding: '10px 24px',
          marginTop: 12,
          background: 'rgba(176, 38, 255, 0.15)',
          color: 'var(--color-purple)',
          border: '2px solid var(--color-purple)',
          borderRadius: '4px',
          cursor: 'pointer',
          letterSpacing: '2px',
          boxShadow: '0 0 6px var(--color-purple)',
          flexShrink: 0,
        }}
      >
        NEW RACE
      </motion.button>
    </motion.div>
  )
}
