import * as Core from '@commerce/types'

// TODO: this type should match:
// https://developer.bigcommerce.com/api-reference/cart-checkout/server-server-cart-api/cart/getacart#responses
export type SolidusCart = {
  id: string
  parent_id?: string
  customer_id: number
  email: string
  currency: { code: string }
  tax_included: boolean
  base_amount: number
  discount_amount: number
  cart_amount: number
  lineItems: {
    edges: any[]
    options?: any[]
    custom_items: any[]
    digital_items: any[]
    gift_certificates: any[]
    physical_items: any[]
  }
  created_time: string
  discounts?: { id: number; discounted_amount: number }[]
  currentOrder: any
  createdAt: string
  includedTaxTotal: boolean
  itemTotal: number
  promoTotal: number
  total: number
  // TODO: add missing fields
}

export type Cart = Core.Cart & {
  lineItems: any[]
}

export type LineItem = {
  id: string
  variantId: string
  productId: string
  name: string
  quantity: number
  discounts: Core.Discount[]
  // A human-friendly unique string automatically generated from the product’s name
  path: string
  variant: Core.ProductVariant
  options?: any
}

export type Customer = {
  id: string
}

/**
 * Cart mutations
 */

export type OptionSelections = {
  option_id: number
  option_value: number | string
}

export type CartItemBody = Core.CartItemBody & {
  productId: string // The product id is always required for BC
  optionSelections?: OptionSelections
}

export type GetCartHandlerBody = Core.GetCartHandlerBody

export type AddCartItemBody = Core.AddCartItemBody<CartItemBody>

export type AddCartItemHandlerBody = Core.AddCartItemHandlerBody<CartItemBody>

export type UpdateCartItemBody = Core.UpdateCartItemBody<CartItemBody>

export type UpdateCartItemHandlerBody = Core.UpdateCartItemHandlerBody<CartItemBody>

export type RemoveCartItemBody = Core.RemoveCartItemBody

export type RemoveCartItemHandlerBody = Core.RemoveCartItemHandlerBody
