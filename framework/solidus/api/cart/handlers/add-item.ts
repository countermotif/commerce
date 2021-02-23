import { parseCartItem } from '../../utils/parse-item'
import getCartCookie from '../../utils/get-cart-cookie'
import type { CartHandlers } from '..'
import { createOrder, addToCart, getOrder } from '../../mutations/cart'
import { Logger } from 'tslog'

const addItem: CartHandlers['addItem'] = async ({
  res,
  body: { cartId, item },
  config,
}) => {
  const log: Logger = new Logger();

  if (!item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Missing item' }],
    })
  }
  if (!item.quantity) item.quantity = 1

  const order = cartId
    ? await config.fetch(
        getOrder
      )
    : await config.fetch(
        createOrder,
        { 
          variables: { 
            input: { 
              clientMutationId: 'xxx' 
            } 
          }
        }
      )

  const guestToken = order?.data?.createOrder?.order?.guestToken ?? cartId

  try {
    const { data } = await config.fetch(
      addToCart,
      { 
        variables: { 
          input: { 
            quantity: item.quantity,
            variantId: item.variantId
          } 
        }
      },
      { 
        headers: { 
          'X-Spree-Order-Token': guestToken 
        }
      }
    )

    // Create or update the cart cookie
    res.setHeader(
      'Set-Cookie',
      getCartCookie(config.cartCookie, guestToken, config.cartCookieMaxAge)
    )
    res.status(200).json({ data: data.addToCart.order })
  } catch {
    const order = await config.fetch(
      createOrder,
      { 
        variables: { 
          input: { 
            clientMutationId: 'xxx' 
          } 
        }
      }
    )

    const guestToken = order?.data?.createOrder?.order?.guestToken

    const { data } = await config.fetch(
      addToCart,
      { 
        variables: { 
          input: { 
            quantity: item.quantity,
            variantId: item.variantId
          } 
        }
      },
      { 
        headers: { 
          'X-Spree-Order-Token': guestToken 
        }
      }
    )

    // Create or update the cart cookie
    res.setHeader(
      'Set-Cookie',
      getCartCookie(config.cartCookie, guestToken, config.cartCookieMaxAge)
    )
    res.status(200).json({ data: data.addToCart.order })
  }
}

export default addItem
