import type { GetLoggedInCustomerQuery } from '../../../schema'
import type { CustomersHandlers } from '..'

export const getLoggedInCustomerQuery = /* GraphQL */ `
  query getLoggedInCustomerQuery {
    currentUser {
      id
      email
    }
  }
`

export type Customer = NonNullable<GetLoggedInCustomerQuery['customer']>

const getLoggedInCustomer: CustomersHandlers['getLoggedInCustomer'] = async ({
  req,
  res,
  config,
}) => {
  const token = encodeURIComponent(req.cookies[config.customerCookie])

  if (req.cookies[config.customerCookie]) {
    const { data } = await config.fetch<GetLoggedInCustomerQuery>(
      getLoggedInCustomerQuery,
      undefined,
      {
        headers: {
          cookie: `${config.customerCookie}=${token}`,
        },
      },
    )

    const customer = data.currentUser

    if (!customer) {
      return res.status(400).json({
        data: null,
        errors: [{ message: 'Customer not found', code: 'not_found' }],
      })
    }

    return res.status(200).json({ data: { customer } })
  }

  res.status(200).json({ data: null })
}

export default getLoggedInCustomer
