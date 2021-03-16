import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { SolidusConfig, getConfig } from '..'

export type SolidusApiHandler<
  T = any,
  H extends SolidusHandlers = {},
  Options extends {} = {}
> = (
  req: NextApiRequest,
  res: NextApiResponse<SolidusApiResponse<T>>,
  config: SolidusConfig,
  handlers: H,
  // Custom configs that may be used by a particular handler
  options: Options
) => void | Promise<void>

export type SolidusHandler<T = any, Body = null> = (options: {
  req: NextApiRequest
  res: NextApiResponse<SolidusApiResponse<T>>
  config: SolidusConfig
  body: Body
}) => void | Promise<void>

export type SolidusHandlers<T = any> = {
  [k: string]: SolidusHandler<T, any>
}

export type SolidusApiResponse<T> = {
  data: T | null
  errors?: { message: string; code?: string }[]
}

export default function createApiHandler<
  T = any,
  H extends SolidusHandlers = {},
  Options extends {} = {}
>(
  handler: SolidusApiHandler<T, H, Options>,
  handlers: H,
  defaultOptions: Options
) {
  return function getApiHandler({
    config,
    operations,
    options,
  }: {
    config?: SolidusConfig
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
