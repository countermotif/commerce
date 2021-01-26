import type { RecursivePartial, RecursiveRequired } from '../utils/types'
import { SpreeApiError } from '../utils/errors'
import { SpreeConfig, getConfig } from '..'

async function getAllProducts({
  variables,
  config,
  preview
}: {
  variables?: any,
  config?: SpreeConfig,
  preview?: boolean
}): Promise<any> {
  config = getConfig(config)

  const data = await config.storeApiFetch<any>(
    `/api/v2/storefront/products?include=images`
  )

  const products = data.product

  return { products }
}

export default getAllProducts
