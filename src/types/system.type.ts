import type { PaginationMeta } from './common.type'

export interface System {
  constellation: string
  symbol: string
  sectorSymbol: string
  type: string
  x: number
  y: number
  waypoints: Waypoint[]
  factions: Faction[]
  name: string
}

export interface Waypoint {
  symbol: string
  type: string
  x: number
  y: number
  orbitals: Orbital[]
  orbits?: string
}

export interface Orbital {
  symbol: string
}

export interface Faction {
  symbol: string
}

export interface SystemsResponse {
  data: System[]
  meta: PaginationMeta
}
