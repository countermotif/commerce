import type { RequestInit } from '@vercel/fetch'
import type { CommerceAPIConfig } from '@commerce/api'
import fetchGraphqlApi from './utils/fetch-graphql-api'
import fetchStoreApi from './utils/fetch-store-api'

export interface SpreeConfig extends CommerceAPIConfig {
  // Indicates if the returned metadata with translations should be applied to the
  // data or returned as it is
  applyLocale?: boolean
  storeApiUrl: string
  storeApiToken: string
  storeApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T>
}

const API_URL = process.env.SPREE_STOREFRONT_API_URL
const API_TOKEN = process.env.SPREE_STOREFRONT_API_TOKEN

if (!API_URL) {
  throw new Error(
    `The environment variable SPREE_STOREFRONT_API_URL is missing and it's required to access your store`
  )
}

if (!API_TOKEN) {
  throw new Error(
    `The environment variable SPREE_STOREFRONT_API_TOKEN is missing and it's required to access your store`
  )
}

export class Config {
  private config: SpreeConfig

  constructor(config: Omit<SpreeConfig, 'customerCookie'>) {
    this.config = {
      ...config,
      customerCookie: 'SHOP_TOKEN',
    }
  }

  getConfig(userConfig: Partial<SpreeConfig> = {}) {
    return Object.entries(userConfig).reduce<SpreeConfig>(
      (cfg, [key, value]) => Object.assign(cfg, { [key]: value }),
      { ...this.config }
    )
  }

  setConfig(newConfig: Partial<SpreeConfig>) {
    Object.assign(this.config, newConfig)
  }
}

const ONE_DAY = 60 * 60 * 24
const config = new Config({
  commerceUrl: API_URL,
  apiToken: API_TOKEN,
  cartCookie: 'bc_cartId',
  cartCookieMaxAge: ONE_DAY * 30,
  fetch: fetchGraphqlApi,
  applyLocale: true,
  storeApiUrl: API_URL,
  storeApiToken: API_TOKEN,
  storeApiFetch: fetchStoreApi,
})

export function getConfig(userConfig?: Partial<SpreeConfig>) {
  return config.getConfig(userConfig)
}

export function setConfig(newConfig: Partial<SpreeConfig>) {
  return config.setConfig(newConfig)
}
