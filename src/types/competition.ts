export type Phase = 'form' | 'countdown' | 'race' | 'results'

export interface PlayerData {
  id: string
  name: string
  color: string
  scores: number[]
  diffs: number[]
}

export interface CompetitionData {
  name: string
  courseName: string
  totalHoles: number
  pars: number[]
  players: PlayerData[]
  metrixUrl?: string
}
