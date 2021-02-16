import { parseCartItem } from '../../utils/parse-item'
import getCartCookie from '../../utils/get-cart-cookie'
import type { CartHandlers } from '..'
import { updateCartQuantity } from '../../mutations/cart'

const updateItem: CartHandlers['updateItem'] = async ({
  res,
  body: { cartId, itemId, item },
  config,
}) => {
  if (!cartId || !itemId || !item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  const { data } = await config.fetch(
    updateCartQuantity,
    { 
      variables: { 
        input: { 
          quantity: item.quantity,
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

  // Update the cart cookie
  res.setHeader(
    'Set-Cookie',
    getCartCookie(config.cartCookie, cartId, config.cartCookieMaxAge)
  )
  res.status(200).json({ data: data.updateCartQuantity.order })
}

export default updateItem
