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
    lineItems {
      edges {
        node {
          id
          quantity
          variant {
            id
            sku
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
