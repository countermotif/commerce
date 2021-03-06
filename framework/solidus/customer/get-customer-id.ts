import { GetCustomerIdQuery } from '../schema'
import { SolidusConfig, getConfig } from '../api'

export const getCustomerIdQuery = /* GraphQL */ `
  query getCustomerId {
    customer {
      entityId
    }
  }
`

async function getCustomerId({
  customerToken,
  config,
}: {
  customerToken: string
  config?: SolidusConfig
}): Promise<number | undefined> {
  config = getConfig(config)

  const { data } = await config.fetch<GetCustomerIdQuery>(
    getCustomerIdQuery,
    undefined,
    {
      headers: {
        cookie: `${config.customerCookie}=${customerToken}`,
      },
    }
  )

  return data?.customer?.entityId
}

export default getCustomerId
