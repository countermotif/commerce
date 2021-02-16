import getCartCookie from '../../utils/get-cart-cookie'
import type { CartHandlers } from '..'
import { removeFromCart } from '../../mutations/cart'

const removeItem: CartHandlers['removeItem'] = async ({
  res,
  body: { cartId, itemId },
  config,
}) => {
  if (!cartId || !itemId) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  const { data } = await config.fetch(
    removeFromCart,
    { 
      variables: { 
        input: { 
          lineItemId: itemId
        } 
      }
    },
    { 
      headers: { 
        'X-Spree-Order-Token': cartId 
      }
    }
  )

  res.setHeader(
    'Set-Cookie',
    data
      ? // Update the cart cookie
        getCartCookie(config.cartCookie, cartId, config.cartCookieMaxAge)
      : // Remove the cart cookie if the cart was removed (empty items)
        getCartCookie(config.cartCookie)
  )
  res.status(200).json({ data: data.removeFromCart.order })
}

export default removeItem
