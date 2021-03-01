import { Product } from 'framework/types'
import getAllProducts, { ProductEdge } from '../../../product/get-all-products'
import type { ProductsHandlers } from '../products'
import { productConnectionFragment } from '../../fragments/product'
import { normalizeProduct } from '../../../lib/normalize'

const query = /* GraphQL */ `
  query searchProductsQuery(
    $input: ProductsQueryInput!
  ) {
    products(query: $input) {
      ...productConnnection
    }
  }

  ${productConnectionFragment}
`

const SORT: { [key: string]: string | undefined } = {
  latest: 'id',
  trending: 'total_sold',
  price: 'price',
}

const LIMIT = 12

// Return current cart info
const getProducts: ProductsHandlers['getProducts'] = async ({
  res,
  body: { search, category, brand, sort },
  config,
}) => {
  // Use a dummy base as we only care about the relative path
  //const url = new URL('/v3/catalog/products', 'http://a')

  //url.searchParams.set('is_visible', 'true')
  //url.searchParams.set('limit', String(LIMIT))

  //if (search) url.searchParams.set('keyword', search)

  const taxon = []

  if (category && Number.isInteger(Number(category)))
    taxon.push(category)

  if (brand && Number.isInteger(Number(brand)))
    taxon.push(brand)

  if (sort) {
    const [_sort, direction] = sort.split('-')
    const sortValue = SORT[_sort]

    if (sortValue && direction) {
      //url.searchParams.set('sort', sortValue)
      //url.searchParams.set('direction', direction)
    }
  }

  // We only want the id of each product
  //url.searchParams.set('include_fields', 'id')

  //const { data } = await config.storeApiFetch<{ data: { id: number }[] }>(
  //  url.pathname + url.search
  //)

  const { data } = await config.fetch<RecursivePartial<GetAllProductsQuery>>(
    query,
    { variables: { input: { keywords: search, taxon: taxon.length > 0 ? taxon : null } } }
  )

  const result = data.products?.edges
  const products = result.map(({ node }) => normalizeProduct(node as any))
  const found = products.length > 0

  res.status(200).json({ data: { products, found } })
}

export default getProducts
