import { ShipNavigationStatus } from '@/pages/fleet/fleet.enum'
import type { PaginationMeta } from './common.type'

export interface Ship {
  symbol: string
  registration: ShipRegistration
  nav: ShipNav
  crew: ShipCrew
  frame: ShipFrame
  reactor: ShipReactor
  engine: ShipEngine
  modules: ShipModule[]
  mounts: ShipMount[]
  cargo: ShipCargo
  fuel: ShipFuel
  cooldown?: ShipCooldown
}

export interface ShipRegistration {
  name: string
  factionSymbol: string
  role: string
}

export interface ShipNav {
  systemSymbol: string
  waypointSymbol: string
  route: ShipRoute
  status: ShipNavigationStatus
  flightMode: string
}

export interface ShipRoute {
  destination: RouteWaypoint
  origin: RouteWaypoint
  departureTime: string
  arrival: string
}

export interface RouteWaypoint {
  symbol: string
  type: string
  systemSymbol: string
  x: number
  y: number
}

export interface ShipCrew {
  current: number
  required: number
  capacity: number
  rotation: string
  morale: number
  wages: number
}

export interface ShipFrame {
  symbol: string
  name: string
  description: string
  condition: number
  integrity: number
  moduleSlots: number
  mountingPoints: number
  fuelCapacity: number
  requirements: ShipRequirements
  quality: number
}

export interface ShipReactor {
  symbol: string
  name: string
  description: string
  condition: number
  integrity: number
  powerOutput: number
  requirements: ShipRequirements
  quality: number
}

export interface ShipEngine {
  symbol: string
  name: string
  description: string
  condition: number
  integrity: number
  speed: number
  requirements: ShipRequirements
  quality: number
}

export interface ShipModule {
  symbol: string
  capacity?: number
  range?: number
  name: string
  description: string
  requirements: ShipRequirements
}

export interface ShipMount {
  symbol: string
  name: string
  description: string
  strength?: number
  deposits?: string[]
  requirements: ShipRequirements
}

export interface ShipRequirements {
  power?: number
  crew?: number
  slots?: number
}

export interface ShipCargo {
  capacity: number
  units: number
  inventory: CargoItem[]
}

export interface CargoItem {
  symbol: string
  name: string
  description: string
  units: number
}

export interface ShipFuel {
  current: number
  capacity: number
  consumed?: {
    amount: number
    timestamp: string
  }
}

export interface ShipCooldown {
  shipSymbol: string
  totalSeconds: number
  remainingSeconds: number
  expiration: string
}

export interface ShipsResponse {
  data: Ship[]
  meta: PaginationMeta
}
