export const orderInfoFragment = /* GraphQL */ `
  fragment orderInfo on Order {
    id
    email
    createdAt
    currency
    includedTaxTotal
    itemTotal
    promoTotal
    total
    guestToken
    state
    lineItems {
      edges {
        node {
          id
          quantity
          price
          variant {
            id
            sku
            optionValues {
              edges {
                node {
                  id
                  name
                  position
                  presentation
                  optionType {
                    id
                    name
                    position
                    presentation
                  }
                }
              }
            }
            product {
              id
              name
              slug
            }
            images {
              edges {
                node {
                  largeUrl
                }
              }
            }
          }
        }
      }
    }
  }
`
