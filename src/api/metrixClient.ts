import type { CompetitionData, DivisionData, PlayerData } from '../types/competition'

interface MetrixPlayerResult {
  Result: string
  Diff: number
}

interface MetrixResult {
  UserID: string
  Name: string
  ClassName: string
  PlayerResults: MetrixPlayerResult[]
  Place: number
}

interface MetrixSubCompetition {
  ID: number
  Name: string
  CourseName: string
  Results: MetrixResult[]
  Tracks: { Number: string; Par: string }[]
}

interface MetrixCompetition {
  Competition: {
    ID: number
    Name: string
    CourseName: string
    Results: MetrixResult[]
    Tracks: { Number: string; Par: string }[]
    SubCompetitions?: MetrixSubCompetition[]
  }
}

interface RoundData {
  pars: number[]
  results: MetrixResult[]
}

function getRounds(competition: MetrixCompetition['Competition']): RoundData[] {
  const { Results, Tracks, SubCompetitions } = competition

  // Multi-round: SubCompetitions present and top-level Results empty
  if (SubCompetitions && SubCompetitions.length > 0 && (!Results || Results.length === 0)) {
    return SubCompetitions.map(sub => ({
      pars: sub.Tracks.map(t => parseInt(t.Par, 10)),
      results: sub.Results || [],
    }))
  }

  // Single round: results directly on competition
  if (Tracks && Tracks.length > 0) {
    return [{
      pars: Tracks.map(t => parseInt(t.Par, 10)),
      results: Results || [],
    }]
  }

  return []
}

function getValidPlayerIds(rounds: RoundData[]): Set<string> {
  // A player must have complete results in ALL rounds
  const perRound = rounds.map(round => {
    const holesInRound = round.pars.length
    const validIds = new Set<string>()
    for (const result of round.results) {
      if (!result.PlayerResults || result.PlayerResults.length === 0) continue
      const validScores = result.PlayerResults.filter(pr => pr.Result && pr.Result !== '0' && pr.Result !== '')
      if (validScores.length === holesInRound) {
        validIds.add(result.UserID)
      }
    }
    return validIds
  })

  // Intersect all rounds
  const validIds = new Set(perRound[0])
  for (let i = 1; i < perRound.length; i++) {
    for (const id of validIds) {
      if (!perRound[i].has(id)) {
        validIds.delete(id)
      }
    }
  }

  return validIds
}

export async function fetchCompetitionFromMetrix(competitionId: number): Promise<CompetitionData> {
  const url = `https://discgolfmetrix.com/api.php?content=result&id=${competitionId}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Metrix API error: ${response.status}`)
  }

  const data: MetrixCompetition = await response.json()
  const { Competition } = data

  if (!Competition) {
    throw new Error('Competition not found')
  }

  const rounds = getRounds(Competition)

  if (rounds.length === 0 || rounds.some(r => r.pars.length === 0)) {
    throw new Error('No track/hole data found')
  }

  if (rounds.every(r => r.results.length === 0)) {
    throw new Error('No results found for this competition')
  }

  // Combined pars across all rounds
  const allPars = rounds.flatMap(r => r.pars)
  const totalHoles = allPars.length

  const validIds = getValidPlayerIds(rounds)

  if (validIds.size === 0) {
    throw new Error('No players with complete results found')
  }

  // Build a map of player data by combining all rounds
  // Use the last round's Place for sorting (final standings)
  const lastRound = rounds[rounds.length - 1]
  const playerOrder = lastRound.results
    .filter(r => validIds.has(r.UserID))
    .sort((a, b) => a.Place - b.Place)

  // Build lookup: userId -> results per round
  const roundResultsByPlayer = rounds.map(round => {
    const map = new Map<string, MetrixResult>()
    for (const result of round.results) {
      map.set(result.UserID, result)
    }
    return map
  })

  // Group by ClassName (from last round)
  const divisionMap = new Map<string, DivisionData>()

  for (const playerRef of playerOrder) {
    const className = playerRef.ClassName || 'Open'

    if (!divisionMap.has(className)) {
      divisionMap.set(className, { className, players: [] })
    }

    // Combine scores across all rounds
    const combinedScores: number[] = []
    const combinedDiffs: number[] = []

    let holeOffset = 0
    for (let roundIdx = 0; roundIdx < rounds.length; roundIdx++) {
      const roundResult = roundResultsByPlayer[roundIdx].get(playerRef.UserID)
      const roundPars = rounds[roundIdx].pars

      if (roundResult) {
        for (let h = 0; h < roundPars.length; h++) {
          const score = parseInt(roundResult.PlayerResults[h].Result, 10)
          combinedScores.push(score)
          combinedDiffs.push(score - allPars[holeOffset + h])
        }
      }
      holeOffset += roundPars.length
    }

    const player: PlayerData = {
      id: playerRef.UserID,
      name: playerRef.Name,
      color: '',
      className,
      scores: combinedScores,
      diffs: combinedDiffs,
    }

    divisionMap.get(className)!.players.push(player)
  }

  const divisions = Array.from(divisionMap.values())

  return {
    name: Competition.Name,
    courseName: Competition.CourseName,
    totalHoles,
    pars: allPars,
    divisions,
    metrixUrl: `https://discgolfmetrix.com/${competitionId}`,
  }
}
