import type { RequestInit } from '@vercel/fetch'
import type { CommerceAPIConfig } from '@commerce/api'
import fetchGraphqlApi from './utils/fetch-graphql-api'

export interface SolidusConfig extends CommerceAPIConfig {
  // Indicates if the returned metadata with translations should be applied to the
  // data or returned as it is
  applyLocale?: boolean
  storeApiUrl: string
  storeApiToken: string
  storeApiClientId: string
  storeChannelId?: string
  storeApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T>
}

const API_URL = process.env.SOLIDUS_STOREFRONT_API_URL
const API_TOKEN = process.env.SOLIDUS_STOREFRONT_API_TOKEN

if (!API_URL) {
  throw new Error(
    `The environment variable SOLIDUS_STOREFRONT_API_URL is missing and it's required to access your store`
  )
}

if (!API_TOKEN) {
  throw new Error(
    `The environment variable SOLIDUS_STOREFRONT_API_TOKEN is missing and it's required to access your store`
  )
}

export class Config {
  private config: SolidusConfig

  constructor(config: Omit<SolidusConfig, 'customerCookie'>) {
    this.config = {
      ...config,
      // The customerCookie is not customizable for now, BC sets the cookie and it's
      // not important to rename it
      customerCookie: 'SHOP_TOKEN',
    }
  }

  getConfig(userConfig: Partial<SolidusConfig> = {}) {
    return Object.entries(userConfig).reduce<SolidusConfig>(
      (cfg, [key, value]) => Object.assign(cfg, { [key]: value }),
      { ...this.config }
    )
  }

  setConfig(newConfig: Partial<SolidusConfig>) {
    Object.assign(this.config, newConfig)
  }
}

const ONE_DAY = 60 * 60 * 24
const config = new Config({
  commerceUrl: API_URL,
  apiToken: API_TOKEN,
  cartCookie: process.env.SOLIDUS_CART_COOKIE ?? 'bc_cartId',
  cartCookieMaxAge: ONE_DAY * 30,
  fetch: fetchGraphqlApi,
  applyLocale: true,
})

export function getConfig(userConfig?: Partial<SolidusConfig>) {
  return config.getConfig(userConfig)
}

export function setConfig(newConfig: Partial<SolidusConfig>) {
  return config.setConfig(newConfig)
}
