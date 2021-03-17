import type { Cart, SolidusCart, LineItem } from '../types'
import type { Product } from '@commerce/types'
import update from './immutability'

const host = process.env.SOLIDUS_STOREFRONT_HOST

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
    name,
    description,
    variants,
    optionTypes,
    slug,
  } = productNode

  return {
    id: id,
    name: name,
    description: description,
    images: masterVariant.images?.edges?.length > 0
      ? masterVariant.images.edges?.map(({ node: { largeUrl, alt } }: any) => ({url: host + largeUrl, alt: alt }))
      : variants.edges[0]?.node?.images.edges?.map(({ node: { largeUrl, alt } }: any) => ({url: host + largeUrl, alt: alt })),
    variants: variants?.edges?.length > 0
      ? variants.edges?.map(({ node: { id, optionValues } }: any) => ({
        id: id,
        options: optionValues?.edges
          ? optionValues?.edges.map(({ node }: any) => normalizeOptionValues(node))
          : [],
      }))
      : [{ id: masterVariant.id, options: [] }],
    options: optionTypes.edges
        ? optionTypes?.edges.map(({ node }: any) => normalizeOptionTypes(node))
        : [],
    brand: '?',
    slug: slug,
    path: slug,
    price: {
      value: Number(masterVariant?.defaultPrice.amount),
      retailPrice: Number(masterVariant?.defaultPrice.amount),
      currencyCode: String(masterVariant?.defaultPrice?.currency?.isoCode),
    },
  }
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

export function normalizeCart(data: any): Cart {
  return {
    id: data.id,
    customerId: undefined,
    email: data.email,
    createdAt: data.createdAt,
    currency: { code: data.currency },
    taxesIncluded: data.includedTaxTotal,
    lineItems: data.lineItems?.edges.map(({ node }: any) => normalizeLineItem(node)),
    lineItemsSubtotalPrice: data.itemTotal,
    subtotalPrice: Number(data.itemTotal) + Number(data.promoTotal),
    totalPrice: data.total,
    discounts: null,
  }
}

function normalizeLineItem(item: any): LineItem {
  const image_host = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http://localhost:5555/' : 'https://amazing-store-ad-bibendum.herokuapp.com/' 

  const optionValues = item.variant?.optionValues?.edges || []
  const distinctOptionValues = Array.from(new Set(optionValues.map(s => s.node.id)))
    .map(id => {
      return optionValues.find(s => s.node.id === id)
    })

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
        url: image_host + item.variant.images.edges[0].node.largeUrl,
      },
      requiresShipping: true,
      price: item.price,
      listPrice: item.price,
    },
    options: distinctOptionValues.map(({ node }: any) => normalizeOptionValues(node)),
    path: item.variant.product.slug,
    discounts: [],
  }
}
