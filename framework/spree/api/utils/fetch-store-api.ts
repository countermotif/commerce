import type { RequestInit, Response } from '@vercel/fetch'
import { getConfig } from '..'
import { SpreeApiError, SpreeNetworkError } from './errors'
import fetch from './fetch'
import normalize from '../utils/normalize';
import { isUndefined } from 'util';

export default async function fetchStoreApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const config = getConfig()
  let res: Response

  try {
    res = await fetch(config.commerceUrl + endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/vnd.api+json',
        'X-Auth-Token': config.storeApiToken,
      },
    })
  } catch (error) {
    throw new SpreeNetworkError(
      `Fetch to Spree failed: ${error.message}`
    )
  }

  const contentType = res.headers.get('Content-Type')
  const isJSON = contentType?.includes('application/vnd.api+json')

  if (!res.ok) {
    const data = isJSON ? await res.json() : await getTextOrNull(res)
    const headers = getRawHeaders(res)
    const msg = `Spree API error (${
      res.status
    }) \nHeaders: ${JSON.stringify(headers, null, 2)}\n${
      typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    }`

    throw new SpreeApiError(msg, res, data)
  }


  if (res.status !== 200 && !isJSON) {
    throw new SpreeApiError(
      `Fetch to Spree API failed, expected JSON content but found: ${contentType}`,
      res
    )
  }

  //res.json().then(items => console.log('items: ', items))

  // If something was removed, the response will be empty
  return res.status === 200 ? await res.json().then(data => normalize(data)) : null
}

function getRawHeaders(res: Response) {
  const headers: { [key: string]: string } = {}

  res.headers.forEach((value, key) => {
    headers[key] = value
  })

  return headers
}

function getTextOrNull(res: Response) {
  try {
    return res.text()
  } catch (err) {
    return null
  }
}
