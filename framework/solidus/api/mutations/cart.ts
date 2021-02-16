import { orderInfoFragment } from '../fragments/cart'

export const addToCart = /* GraphQL */ `
  mutation addToCart($input: AddToCartInput!) { 
    addToCart(input: $input) {
      order {
        ...orderInfo
      }
    }
  }

  ${orderInfoFragment}
`

export const createOrder = /* GraphQL */ `
  mutation createOrder($input: CreateOrderInput!) { 
     createOrder(input: $input) {
       order {
         ...orderInfo
       }
     }
  }
`

export const getOrder = /* GraphQL */ `
  query getOrder {
    currentOrder {
      ...orderInfo
    }
  }

  ${orderInfoFragment}
`

export const updateCartQuantity = /* GraphQL */ `
  mutation updateCartQuantity($input: UpdateCartQuantityInput!) { 
    updateCartQuantity(input: $input) {
      order {
        ...orderInfo
      }
    }
  }

  ${orderInfoFragment}
`

export const removeFromCart = /* GraphQL */ `
  mutation removeFromCart($input: RemoveFromCartInput!) { 
    removeFromCart(input: $input) {
      order {
        ...orderInfo
      }
    }
  }

  ${orderInfoFragment}
`
