export const productPrices = /* GraphQL */ `
  fragment productPrices on Prices {
    price {
      value
      currencyCode
    }
    salePrice {
      value
      currencyCode
    }
    retailPrice {
      value
      currencyCode
    }
  }
`

export const swatchOptionFragment = /* GraphQL */ `
  fragment swatchOption on SwatchOptionValue {
    isDefault
    hexColors
  }
`

export const multipleChoiceOptionFragment = /* GraphQL */ `
  fragment multipleChoiceOption on MultipleChoiceOption {
    values {
      edges {
        node {
          label
          ...swatchOption
        }
      }
    }
  }

  ${swatchOptionFragment}
`

export const productInfoFragment = /* GraphQL */ `
  fragment productInfo on Product {
    id
    name
    slug
    description
    masterVariant {
      defaultPrice {
        amount
        currency {
          isoCode
        }
      }
      prices {
        edges {
          node {
            id
          }
        }
      }
      images {
        edges {
          node {
            largeUrl
            alt
          }
        }
      }
    }
    variants {
      edges {
        node {
          images {
            edges {
              node {
                largeUrl
                alt
              }
            }
          }
        }
      }
    }
  }
`

export const productConnectionFragment = /* GraphQL */ `
  fragment productConnnection on ProductConnection {
    pageInfo {
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        ...productInfo
      }
    }
  }

  ${productInfoFragment}
`
