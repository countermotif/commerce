import createApiHandler, {
  SolidusApiHandler,
  SolidusHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { SolidusApiError } from '../utils/errors'
import login from './handlers/login'

export type LoginBody = {
  email: string
  password: string
}

export type LoginHandlers = {
  login: SolidusHandler<null, Partial<LoginBody>>
}

const METHODS = ['POST']

const loginApi: SolidusApiHandler<null, LoginHandlers> = async (
  req,
  res,
  config,
  handlers
) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  try {
    const body = req.body ?? {}
    return await handlers['login']({ req, res, config, body })
  } catch (error) {
    console.error(error)

    const message =
      error instanceof SolidusApiError
        ? 'An unexpected error ocurred with the Solidus API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

const handlers = { login }

export default createApiHandler(loginApi, handlers, {})
