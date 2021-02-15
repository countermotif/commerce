import type { Cart, BigcommerceCart, LineItem } from '../types'
import update from './immutability'

function normalizeOptionTypes(optionType: any) {
  const {
    id,
    presentation,
    name
  } = optionType

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
    customerId: String(data.customer_id),
    email: data.email,
    createdAt: data.created_time,
    currency: data.currency,
    taxesIncluded: data.tax_included,
    lineItems: data.line_items.physical_items.map(normalizeLineItem),
    lineItemsSubtotalPrice: data.base_amount,
    subtotalPrice: data.base_amount + data.discount_amount,
    totalPrice: data.cart_amount,
    discounts: data.discounts?.map((discount) => ({
      value: discount.discounted_amount,
    })),
  }
}

function normalizeLineItem(item: any): LineItem {
  return {
    id: item.id,
    variantId: String(item.variant_id),
    productId: String(item.product_id),
    name: item.name,
    quantity: item.quantity,
    variant: {
      id: String(item.variant_id),
      sku: item.sku,
      name: item.name,
      image: {
        url: item.image_url,
      },
      requiresShipping: item.is_require_shipping,
      price: item.sale_price,
      listPrice: item.list_price,
    },
    path: item.url.split('/')[3],
    discounts: item.discounts.map((discount: any) => ({
      value: discount.discounted_amount,
    })),
  }
}
