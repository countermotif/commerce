import type { Response } from '@vercel/fetch'

export class SpreeApiError extends Error {
  status: number
  res: Response
  data: any

  constructor(msg: string, res: Response, data?: any) {
    super(msg)
    this.name = 'SpreeApiError'
    this.status = res.status
    this.res = res
    this.data = data
  }
}

export class SpreeNetworkError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'SpreeNetworkError'
  }
}
