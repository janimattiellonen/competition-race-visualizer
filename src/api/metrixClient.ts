import type { CompetitionData } from '../types/competition'

interface MetrixPlayerResult {
  Result: string
  Diff: number
}

interface MetrixResult {
  UserID: string
  Name: string
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

  const players = Results
    .filter(result => {
      if (!result.PlayerResults || result.PlayerResults.length === 0) return false
      const validScores = result.PlayerResults.filter(pr => pr.Result && pr.Result !== '0' && pr.Result !== '')
      return validScores.length === totalHoles
    })
    .sort((a, b) => a.Place - b.Place)
    .map(result => {
      const scores = result.PlayerResults.map(pr => parseInt(pr.Result, 10))
      const diffs = scores.map((score, i) => score - pars[i])

      return {
        id: result.UserID,
        name: result.Name,
        color: '',
        scores,
        diffs,
      }
    })

  if (players.length === 0) {
    throw new Error('No players with complete results found')
  }

  return {
    name: Name,
    courseName: CourseName,
    totalHoles,
    pars,
    players,
    metrixUrl: `https://discgolfmetrix.com/${competitionId}`,
  }
}
