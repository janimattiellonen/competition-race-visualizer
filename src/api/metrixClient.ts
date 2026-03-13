import type { CompetitionData, DivisionData } from '../types/competition'

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

interface MetrixCompetition {
  Competition: {
    ID: number
    Name: string
    CourseName: string
    Results: MetrixResult[]
    Tracks: { Number: string; Par: string }[]
  }
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

  const { Results, Tracks, Name, CourseName } = Competition

  if (!Results || Results.length === 0) {
    throw new Error('No results found for this competition')
  }

  if (!Tracks || Tracks.length === 0) {
    throw new Error('No track/hole data found')
  }

  const pars = Tracks.map(t => parseInt(t.Par, 10))
  const totalHoles = pars.length

  const validResults = Results
    .filter(result => {
      if (!result.PlayerResults || result.PlayerResults.length === 0) return false
      const validScores = result.PlayerResults.filter(pr => pr.Result && pr.Result !== '0' && pr.Result !== '')
      return validScores.length === totalHoles
    })
    .sort((a, b) => a.Place - b.Place)

  if (validResults.length === 0) {
    throw new Error('No players with complete results found')
  }

  // Group by ClassName
  const divisionMap = new Map<string, DivisionData>()

  for (const result of validResults) {
    const className = result.ClassName || 'Open'

    if (!divisionMap.has(className)) {
      divisionMap.set(className, { className, players: [] })
    }

    const scores = result.PlayerResults.map(pr => parseInt(pr.Result, 10))
    const diffs = scores.map((score, i) => score - pars[i])

    divisionMap.get(className)!.players.push({
      id: result.UserID,
      name: result.Name,
      color: '',
      className,
      scores,
      diffs,
    })
  }

  const divisions = Array.from(divisionMap.values())

  return {
    name: Name,
    courseName: CourseName,
    totalHoles,
    pars,
    divisions,
    metrixUrl: `https://discgolfmetrix.com/${competitionId}`,
  }
}
