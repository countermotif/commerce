import type {
  GetAllProductPathsQuery,
  GetAllProductPathsQueryVariables,
} from '../schema'
import type { RecursivePartial, RecursiveRequired } from '../api/utils/types'
import filterEdges from '../api/utils/filter-edges'
import { SolidusConfig, getConfig } from '../api'
import { normalizeProductPath } from '../lib/normalize'

export const getAllProductPathsQuery = /* GraphQL */ `
  query getAllProductPaths($first: Int = 100) {
    currentStore {
      products(first: $first) {
        edges {
          node {
            slug
          }
        }
      }
    }
  }
`

export type ProductPath = NonNullable<
  NonNullable<any['currentStore']['products']['edges']>[0]
>

export type ProductPaths = ProductPath[]

export type { GetAllProductPathsQueryVariables }

export type GetAllProductPathsResult<
  T extends { products: any[] } = { products: ProductPaths }
> = T

async function getAllProductPaths(opts?: {
  variables?: GetAllProductPathsQueryVariables
  config?: SolidusConfig
}): Promise<GetAllProductPathsResult>

async function getAllProductPaths<
  T extends { products: any[] },
  V = any
>(opts: {
  query: string
  variables?: V
  config?: SolidusConfig
}): Promise<GetAllProductPathsResult<T>>

async function getAllProductPaths({
  query = getAllProductPathsQuery,
  variables,
  config,
}: {
  query?: string
  variables?: GetAllProductPathsQueryVariables
  config?: SolidusConfig
} = {}): Promise<GetAllProductPathsResult> {
  config = getConfig(config)
  // RecursivePartial forces the method to check for every prop in the data, which is
  // required in case there's a custom `query`
  const { data } = await config.fetch(query, { variables })
  const products = data.currentStore?.products?.edges

  return {
    products: products.map(normalizeProductPath),
  }
}

export default getAllProductPaths
