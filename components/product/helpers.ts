import type { ProductNode } from '@framework/api/operations/get-product'

export type SelectedOptions = {
  size: string | null
  color: string | null
}

export type ProductOption = {
  displayName: string
  values: any
}

// Returns the available options of a product
export function getProductOptions(product: ProductNode) {
  const options = product.optionTypes.edges?.reduce<ProductOption[]>(
    (arr, edge) => {
      arr.push({
        displayName: edge.node.presentation.toLowerCase(),
        values: edge.node.optionValues.edges?.map((edge) => edge?.node),
      })
      return arr
    },
    []
  )

  return options
}

// Finds a variant in the product that matches the selected options
export function getCurrentVariant(product: ProductNode, opts: SelectedOptions) {
  const variant = product.variants.edges?.find((edge) => {
    const { node } = edge ?? {}

    //console.log(Object.entries(opts))
    return Object.entries(opts).every(([key, value]) => {
      const arrayUniqueByKey = [...new Map(node?.optionValues.edges?.map(item =>
        [item.node['id'], item])).values()];

      return arrayUniqueByKey?.find(
        (valueEdge) => {
          return valueEdge?.node.id === value
        }
      )
    })
  })

  return variant?.node
}
