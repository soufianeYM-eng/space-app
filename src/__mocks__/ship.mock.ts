import type { Ship, ShipsResponse } from '@/types/ship.type'
import { ShipNavigationStatus } from '@/pages/fleet/fleet.enum'

export function getShipMock(): Ship {
  return {
    symbol: 'TEST-SHIP-1',
    registration: {
      name: 'Test Ship 1',
      factionSymbol: 'COSMIC',
      role: 'COMMAND',
    },
    nav: {
      systemSymbol: 'X1-TEST',
      waypointSymbol: 'X1-TEST-A1',
      route: {
        destination: {
          symbol: 'X1-TEST-A1',
          type: 'PLANET',
          systemSymbol: 'X1-TEST',
          x: 0,
          y: 0,
        },
        origin: {
          symbol: 'X1-TEST-A1',
          type: 'PLANET',
          systemSymbol: 'X1-TEST',
          x: 0,
          y: 0,
        },
        departureTime: '2024-01-01T00:00:00Z',
        arrival: '2024-01-01T01:00:00Z',
      },
      status: ShipNavigationStatus.DOCKED,
      flightMode: 'CRUISE',
    },
    crew: {
      current: 50,
      required: 40,
      capacity: 60,
      rotation: 'STRICT',
      morale: 100,
      wages: 10,
    },
    frame: {
      symbol: 'FRAME_FRIGATE',
      name: 'Frigate',
      description: 'A medium-sized ship',
      condition: 100,
      integrity: 100,
      moduleSlots: 8,
      mountingPoints: 4,
      fuelCapacity: 1200,
      requirements: { power: 8, crew: 40 },
      quality: 1,
    },
    reactor: {
      symbol: 'REACTOR_FISSION_I',
      name: 'Fission Reactor I',
      description: 'Basic fission reactor',
      condition: 100,
      integrity: 100,
      powerOutput: 31,
      requirements: { crew: 8 },
      quality: 1,
    },
    engine: {
      symbol: 'ENGINE_ION_DRIVE_I',
      name: 'Ion Drive I',
      description: 'Basic ion drive',
      condition: 100,
      integrity: 100,
      speed: 30,
      requirements: { power: 8, crew: 8 },
      quality: 1,
    },
    modules: [],
    mounts: [],
    cargo: {
      capacity: 100,
      units: 0,
      inventory: [],
    },
    fuel: {
      current: 1200,
      capacity: 1200,
    },
  } as Ship
}

export function getShipsResponseMock(): ShipsResponse {
  return {
    data: [getShipMock()],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
    },
  }
}
