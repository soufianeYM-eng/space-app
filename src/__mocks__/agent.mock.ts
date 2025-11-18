import type { Agent } from '@/types/agent.type'

export function getAgentMock(): Agent {
  return {
    id: 'test-id',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z',
  }
}
