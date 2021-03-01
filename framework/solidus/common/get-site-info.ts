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
                permalink
                parentTaxon {
                  id
                  name
                }
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

  const categoryTree = data.taxonomies?.edges.filter(({ node }: any) => {
    return node.name == 'Categories'
  })[0]

  const filteredCategories = categoryTree?.node?.taxons.edges.filter(({ node }: any) => {
    return node.parentTaxon?.name == 'Categories'
  })

  const categories = filteredCategories.map(({ node }: any) => {
    return { 
      id: node.id,
      entityId: node.id,
      name: node.name,
      path: node.permalink.replace('categories/','')
    }
  })

  const brandTree = data.taxonomies?.edges.filter(({ node }: any) => {
    return node.name == 'Brand'
  })[0]

  const filteredBrands = brandTree?.node?.taxons.edges.filter(({ node }: any) => {
    return node.parentTaxon?.name == 'Brand'
  })

  const brands = filteredBrands.map(({ node }: any) => {
    return { node: {
      id: node.id,
      entityId: node.id,
      name: node.name,
      path: node.permalink.replace('brand/','designers/')
    }}
  })

  log.warn(brands)

  return {
    categories: (categories as RecursiveRequired<typeof categories>) ?? [],
    brands: filterEdges(brands as RecursiveRequired<typeof brands>),
  }
}

export default getSiteInfo
