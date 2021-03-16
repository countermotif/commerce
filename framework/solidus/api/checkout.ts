import isAllowedMethod from './utils/is-allowed-method'
import createApiHandler, {
  SolidusApiHandler,
} from './utils/create-api-handler'
import { SolidusApiError } from './utils/errors'

const METHODS = ['GET']
const fullCheckout = true

// TODO: a complete implementation should have schema validation for `req.body`
const checkoutApi: SolidusApiHandler<any> = async (req, res, config) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { cookies } = req
  const cartId = cookies[config.cartCookie]

  try {
    if (!cartId) {
      res.redirect('/cart')
      return
    }

    const checkout_host = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http://localhost:5555/' : 'https://amazing-store-ad-bibendum.herokuapp.com/' 

    if (fullCheckout) {
      if (cookies[config.customerCookie]) {
        res.redirect(`${checkout_host}orders/${cartId}/checkout`)
      } else {
        res.redirect(`${checkout_host}orders/${cartId}/checkout`)
      }
      return
    }

    // // TODO: make the embedded checkout work too!
    // const html = `
    //   <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>Checkout</title>
    //       <script src="https://checkout-sdk.bigcommerce.com/v1/loader.js"></script>
    //       <script>
    //         window.onload = function() {
    //           checkoutKitLoader.load('checkout-sdk').then(function (service) {
    //             service.embedCheckout({
    //               containerId: 'checkout',
    //               url: '${data.embedded_checkout_url}'
    //             });
    //           });
    //         }
    //       </script>
    //     </head>
    //     <body>
    //       <div id="checkout"></div>
    //     </body>
    //   </html>
    // `

    // res.status(200)
    // res.setHeader('Content-Type', 'text/html')
    // res.write(html)
    // res.end()
  } catch (error) {
    console.error(error)

    const message =
      error instanceof SolidusApiError
        ? 'An unexpected error ocurred with the Solidus API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export default createApiHandler(checkoutApi, {}, {})
