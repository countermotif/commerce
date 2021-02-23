import { BigcommerceApiError } from '../../utils/errors'
import login from '../../../auth/login'
import { SignupHandlers } from '../signup'
import type { RecursivePartial } from '../../utils/types'

export const createUserMutation = /* GraphQL */ `
  mutation createUser($input: CreateUserInput!) { 
     createUser(input: $input) {
       user {
         id
       }
       errors {
         message
       }
     }
  }
`

const signup: SignupHandlers['signup'] = async ({
  res,
  body: { firstName, lastName, email, password },
  config,
}) => {
  // TODO: Add proper validations with something like Ajv
  if (!(firstName && lastName && email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }
  // TODO: validate the password and email
  // Passwords must be at least 7 characters and contain both alphabetic
  // and numeric characters.

  const { data } = await config.fetch<RecursivePartial<typeof createUserMutation>>(
    createUserMutation,
    { 
      variables: {
        input: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }
      }
    }
  )

  if (data.createUser.errors.length > 0) {
    const hasEmailError = data.createUser.errors[0].message == 'has already been taken'
    // If there's an error with the email, it most likely means it's duplicated
    if (hasEmailError) {
      return res.status(400).json({
        data: null,
        errors: [
          {
            message: 'The email is already in use',
            code: 'duplicated_email',
          },
        ],
      })
    }
  }

  // Login the customer right after creating it
  await login({ variables: { email, password }, res, config })

  res.status(200).json({ data: null })
}

export default signup
