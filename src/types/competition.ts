export type Phase = 'form' | 'countdown' | 'race' | 'results'

export interface PlayerData {
  id: string
  name: string
  color: string
  className: string
  scores: number[]
  diffs: number[]
}

export interface DivisionData {
  className: string
  players: PlayerData[]
}

export interface CompetitionData {
  name: string
  courseName: string
  totalHoles: number
  pars: number[]
  divisions: DivisionData[]
  metrixUrl?: string
}
