import type {
  GetAllProductsQuery,
  GetAllProductsQueryVariables,
} from '../schema'
import type { RecursivePartial, RecursiveRequired } from '../api/utils/types'
import filterEdges from '../api/utils/filter-edges'
import setProductLocaleMeta from '../api/utils/set-product-locale-meta'
import { productConnectionFragment } from '../api/fragments/product'
import { SolidusConfig, getConfig } from '../api'
import { normalizeProduct } from '../lib/normalize'
import { Product } from '@commerce/types'


export const getAllProductsQuery = /* GraphQL */ `
  query getAllProducts(
    $first: Int = 10
    $products: Boolean = false
    $featuredProducts: Boolean = false
    $bestSellingProducts: Boolean = false
    $newestProducts: Boolean = false
  ) {
    currentStore {
      products(first: $first) @include(if: $products) {
        ...productConnnection
      }
      featuredProducts(first: $first) @include(if: $featuredProducts) {
        ...productConnnection
      }
      bestSellingProducts(first: $first) @include(if: $bestSellingProducts) {
        ...productConnnection
      }
      newestProducts(first: $first) @include(if: $newestProducts) {
        ...productConnnection
      }
    }
  }

  ${productConnectionFragment}
`

export type ProductEdge = NonNullable<
  NonNullable<any['currentStore']['products']['edges']>[0]
>

export type ProductNode = ProductEdge['node']

export type GetAllProductsResult<
  T extends Record<keyof GetAllProductsResult, any[]> = {
    products: ProductEdge[]
  }
> = T

const FIELDS = [
  'products',
  'featuredProducts',
  'bestSellingProducts',
  'newestProducts',
]

export type ProductTypes =
  | 'products'
  | 'featuredProducts'
  | 'bestSellingProducts'
  | 'newestProducts'

export type ProductVariables = { field?: ProductTypes } & Omit<
  GetAllProductsQueryVariables,
  ProductTypes | 'hasLocale'
>

async function getAllProducts(opts?: {
  variables?: ProductVariables
  config?: SolidusConfig
  preview?: boolean
}): Promise<{ products: Product[] }>

async function getAllProducts<
  T extends Record<keyof GetAllProductsResult, any[]>,
  V = any
>(opts: {
  query: string
  variables?: V
  config?: SolidusConfig
  preview?: boolean
}): Promise<GetAllProductsResult<T>>

async function getAllProducts({
  query = getAllProductsQuery,
  variables: { field = 'products', ...vars } = {},
  config,
}: {
  query?: string
  variables?: ProductVariables
  config?: SolidusConfig
  preview?: boolean
} = {}): Promise<{ products: Product[] | any[] }> {
  config = getConfig(config)

  const locale = vars.locale || config.locale
  const variables: GetAllProductsQueryVariables = {
    ...vars,
    locale,
    hasLocale: !!locale,
  }

  if (!FIELDS.includes(field)) {
    throw new Error(
      `The field variable has to match one of ${FIELDS.join(', ')}`
    )
  }

  variables[field] = true

  // RecursivePartial forces the method to check for every prop in the data, which is
  // required in case there's a custom `query`
  const { data } = await config.fetch(
    query,
    { variables }
  )
  const edges = data.currentStore?.[field]?.edges
  const products = filterEdges(edges)

  if (locale && config.applyLocale) {
    products.forEach((product: RecursivePartial<ProductEdge>) => {
      if (product.node) setProductLocaleMeta(product.node)
    })
  }

  return { products: products.map(({ node }) => normalizeProduct(node as any)) }
}

export default getAllProducts
