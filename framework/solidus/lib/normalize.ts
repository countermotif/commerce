import type { Cart, BigcommerceCart, LineItem } from '../types'
import update from './immutability'

function normalizeOptionTypes(optionType: any) {
  const {
    id,
    presentation,
    name
  } = optionType

  const parentPresentation = presentation

  const updated = update(optionType, {
    values: {
      $set: optionType.optionValues
    }
  })

  return update(updated, {
    id: { $set: String(id) },
    displayName: { $set: presentation },
    values: {
      $apply: ({ edges }: any) =>
        edges?.map(({ node: { id, name, presentation, position } }: any) => ({
          id: id,
          label: presentation,
          hexColors: parentPresentation == 'Color' ? [presentation] : null,
        })),
    }
  })
}

function normalizeOptionValues(optionValue: any) {
  const {
    id,
    name,
    position,
    presentation,
    optionType
  } = optionValue

  return {
    id: optionType.id,
    displayName: optionType.presentation,
    name: optionType.presentation,
    value: presentation,
    values: [ 
      {
        id: id,
        label: presentation
      }
    ]
  }
}

export function normalizeProduct(productNode: any): Product {
  const {
    id,
    masterVariant,
    optionTypes,
    slug,
    id: _,
    options: _0,
  } = productNode


  const updated = update(productNode, {
    images: {
      $set: masterVariant.images
    },
  })

  return update(updated, {
    id: { $set: String(id) },
    images: {
      $apply: ({ edges }: any) =>
        edges?.map(({ node: { largeUrl, alt, ...rest } }: any) => ({
          url: 'http://localhost:5555/' + largeUrl,
          alt: alt,
          ...rest,
        })),
    },
    variants: {
      $apply: ({ edges }: any) =>
        edges?.map(({ node: { id, optionValues, ...rest } }: any) => ({
          id: id,
          options: optionValues?.edges
            ? optionValues?.edges.map(({ node }: any) => normalizeOptionValues(node))
            : [],
          ...rest,
        })),
    },
    options: {
      $set: optionTypes.edges
        ? optionTypes?.edges.map(({ node }: any) => normalizeOptionTypes(node))
        : [],
    },
    brand: {
      $set: '+++BRAND+++'
    },
    slug: {
      $set: slug
    },
    price: {
      $set: {
        value: masterVariant?.defaultPrice.amount,
        currencyCode: masterVariant?.defaultPrice?.currency?.isoCode,
      },
    },
    $unset: ['id'],
  })
}

export function normalizeProductPath(product) {
  return update(product, {
    node: {
      path: {
        $set: '/' + product.node.slug
      }
    }
  })
}

export function normalizeCart(data: BigcommerceCart): Cart {
  return {
    id: data.id,
    customerId: undefined,
    email: data.email,
    createdAt: data.createdAt,
    currency: { 
      code: data.currency 
    },
    taxesIncluded: data.includedTaxTotal,
    lineItems: data.lineItems?.edges.map(({ node }: any) => normalizeLineItem(node)),
    lineItemsSubtotalPrice: data.itemTotal,
    subtotalPrice: Number(data.itemTotal) + Number(data.promoTotal),
    totalPrice: data.total,
    discounts: [data.promoTotal],
  }
}

function normalizeLineItem(item: any): LineItem {
  return {
    id: item.id,
    variantId: String(item.variant.id),
    productId: String(item.variant.product.id),
    name: item.variant.product.name,
    quantity: item.quantity,
    variant: {
      id: String(item.variant.id),
      sku: item.variant.sku,
      name: item.variant.product.name,
      image: {
        url: 'http://localhost:5555/' + item.variant.images.edges[0].node.largeUrl,
      },
      requiresShipping: true,
      price: item.price,
      listPrice: item.price,
    },
    options: item.variant.optionValues?.edges.map(({ node }: any) => normalizeOptionValues(node)),
    path: item.variant.product.slug,
    discounts: [],
  }
}
