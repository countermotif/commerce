import type { Response } from '@vercel/fetch'

// Used for GraphQL errors
export class SolidusGraphQLError extends Error {}

export class SolidusApiError extends Error {
  status: number
  res: Response
  data: any

  constructor(msg: string, res: Response, data?: any) {
    super(msg)
    this.name = 'SolidusApiError'
    this.status = res.status
    this.res = res
    this.data = data
  }
}

export class SolidusNetworkError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'SolidusNetworkError'
  }
}
