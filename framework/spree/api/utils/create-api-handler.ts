import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { SpreeConfig, getConfig } from '..'

export type SpreeApiHandler<
  T = any,
  H extends SpreeHandlers = {},
  Options extends {} = {}
> = (
  req: NextApiRequest,
  res: NextApiResponse<SpreeApiResponse<T>>,
  config: SpreeConfig,
  handlers: H,
  // Custom configs that may be used by a particular handler
  options: Options
) => void | Promise<void>

export type SpreeHandler<T = any, Body = null> = (options: {
  req: NextApiRequest
  res: NextApiResponse<SpreeApiResponse<T>>
  config: SpreeConfig
  body: Body
}) => void | Promise<void>

export type SpreeHandlers<T = any> = {
  [k: string]: SpreeHandler<T, any>
}

export type SpreeApiResponse<T> = {
  data: T | null
  errors?: { message: string; code?: string }[]
}

export default function createApiHandler<
  T = any,
  H extends SpreeHandlers = {},
  Options extends {} = {}
>(
  handler: SpreeApiHandler<T, H, Options>,
  handlers: H,
  defaultOptions: Options
) {
  return function getApiHandler({
    config,
    operations,
    options,
  }: {
    config?: SpreeConfig
    operations?: Partial<H>
    options?: Options extends {} ? Partial<Options> : never
  } = {}): NextApiHandler {
    const ops = { ...operations, ...handlers }
    const opts = { ...defaultOptions, ...options }

    return function apiHandler(req, res) {
      return handler(req, res, getConfig(config), ops, opts)
    }
  }
}
