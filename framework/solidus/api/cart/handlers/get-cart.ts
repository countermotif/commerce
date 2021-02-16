import type { BigcommerceCart } from '../../../types'
import { BigcommerceApiError } from '../../utils/errors'
import getCartCookie from '../../utils/get-cart-cookie'
import type { CartHandlers } from '../'
import { getOrder } from '../../mutations/cart'

// Return current cart info
const getCart: CartHandlers['getCart'] = async ({
  res,
  body: { cartId },
  config,
}) => {
  let result: { data?: BigcommerceCart } = {}

  if (cartId) {
    try {
      result = await config.fetch(
        getOrder,
        {},
        { 
          headers: { 
            'X-Spree-Order-Token': cartId 
          }
        }
      )
    } catch (error) {
      if (error instanceof BigcommerceApiError && error.status === 404) {
        // Remove the cookie if it exists but the cart wasn't found
        res.setHeader('Set-Cookie', getCartCookie(config.cartCookie))
      } else {
        throw error
      }
    }
  }

  res.status(200).json({ data: result.data ?? null })
}

export default getCart
