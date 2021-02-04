//import type { GetProductQuery, GetProductQueryVariables } from '../../schema'
//import setProductLocaleMeta from '../utils/set-product-locale-meta'
import { productInfoFragment } from '../fragments/product'
import { SpreeConfig, getConfig } from '..'
import { Logger } from 'tslog'

const log: Logger = new Logger();

export const getProductQuery = /* GraphQL */ `
  query getProduct(
    $path: String!
  ) {
    productBySlug(slug: $path) {
      ...productInfo
    }
  }

  ${productInfoFragment}
`

export type ProductNode = Extract<
  GetProductQuery['site']['route']['node'],
  { __typename: 'Product' }
>

export type GetProductResult<
  T extends { product?: any } = { product?: ProductNode }
> = T

export type ProductVariables = { locale?: string } & (
  | { path: string; slug?: never }
  | { path?: never; slug: string }
)

async function getProduct(opts: {
  variables: ProductVariables
  config?: SpreeConfig
  preview?: boolean
}): Promise<GetProductResult>

async function getProduct<T extends { product?: any }, V = any>(opts: {
  query: string
  variables: V
  config?: SpreeConfig
  preview?: boolean
}): Promise<GetProductResult<T>>

async function getProduct({
  query = getProductQuery,
  variables: { slug, ...vars },
  config,
}: {
  query?: string
  variables: ProductVariables
  config?: SpreeConfig
  preview?: boolean
}): Promise<GetProductResult> {
  config = getConfig(config)

  const locale = vars.locale || config.locale
  const variables: GetProductQueryVariables = {
    ...vars,
    locale,
    hasLocale: !!locale,
    path: slug ? `${slug}` : vars.path!,
  }
  const { data } = await config.fetch<GetProductQuery>(query, { variables })
  const product = data.productBySlug

  log.warn(product)
  return { product }

  if (product?.__typename === 'Product') {
    if (locale && config.applyLocale) {
      //setProductLocaleMeta(product)
    }
    return { product }
  }

  return {}
}

export default getProduct
