import type { System, SystemsResponse } from '@/types/system.type'

export function getSystemMock(): System {
  return {
    symbol: 'X1-TEST',
    sectorSymbol: 'X1',
    type: 'RED_STAR',
    x: 10,
    y: 20,
    constellation: 'Test Constellation',
    name: 'Test System',
    waypoints: [
      {
        symbol: 'X1-TEST-A1',
        type: 'PLANET',
        x: 5,
        y: 10,
      },
    ],
    factions: [
      {
        symbol: 'COSMIC',
      },
    ],
  } as System
}

export function getSystemsResponseMock(): SystemsResponse {
  return {
    data: [getSystemMock()],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
    },
  }
}
