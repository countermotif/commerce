import { orderInfoFragment } from '../fragments/cart'

export const addToCart = /* GraphQL */ `
  mutation AddToCart($input: AddToCartInput!) { 
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