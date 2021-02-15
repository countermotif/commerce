import type { GetSiteInfoQuery, GetSiteInfoQueryVariables } from '../schema'
import type { RecursivePartial, RecursiveRequired } from '../api/utils/types'
import filterEdges from '../api/utils/filter-edges'
import { SolidusConfig, getConfig } from '../api'
import { categoryTreeItemFragment } from '../api/fragments/category-tree'
import { Logger } from 'tslog'

// Get 3 levels of categories
export const getSiteInfoQuery = /* GraphQL */ `
  query getSiteInfo {
    taxonomies {
      edges {
        node {
          id
          name
          taxons {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`

export type CategoriesTree = NonNullable<
  GetSiteInfoQuery['data']['taxonomies']['edges'][1]['node']['taxons']
>

export type BrandEdge = NonNullable<
  NonNullable<GetSiteInfoQuery['data']['taxonomies']['edges'][0]['node']['taxons']['edges']>[0]
>

export type Brands = BrandEdge[]

export type GetSiteInfoResult<
  T extends { categories: any[]; brands: any[] } = {
    categories: CategoriesTree
    brands: Brands
  }
> = T

async function getSiteInfo(opts?: {
  variables?: GetSiteInfoQueryVariables
  config?: SolidusConfig
  preview?: boolean
}): Promise<GetSiteInfoResult>

async function getSiteInfo<
  T extends { categories: any[]; brands: any[] },
  V = any
>(opts: {
  query: string
  variables?: V
  config?: SolidusConfig
  preview?: boolean
}): Promise<GetSiteInfoResult<T>>

async function getSiteInfo({
  query = getSiteInfoQuery,
  variables,
  config,
}: {
  query?: string
  variables?: GetSiteInfoQueryVariables
  config?: SolidusConfig
  preview?: boolean
} = {}): Promise<GetSiteInfoResult> {
  const log: Logger = new Logger();
  config = getConfig(config)
  // RecursivePartial forces the method to check for every prop in the data, which is
  // required in case there's a custom `query`
  const { data } = await config.fetch<RecursivePartial<GetSiteInfoQuery>>(
    query,
    { variables }
  )

  const categories = data.taxonomies?.edges[0]?.node?.taxons.edges
  const brands = data.taxonomies?.edges[1]?.node?.taxons.edges

  return {
    categories: (categories as RecursiveRequired<typeof categories>) ?? [],
    brands: filterEdges(brands as RecursiveRequired<typeof brands>),
  }
}

export default getSiteInfo
