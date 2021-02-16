import type { ReactNode } from 'react'
import {
  CommerceConfig,
  CommerceProvider as CoreCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@commerce'
import { solidusProvider, SolidusProvider } from './provider'

export { solidusProvider }
export type { SolidusProvider }

export const solidusConfig: CommerceConfig = {
  locale: 'en-us',
  cartCookie: 'bc_cartId',
}

export type SolidusConfig = Partial<CommerceConfig>

export type SolidusProps = {
  children?: ReactNode
  locale: string
} & SolidusConfig

export function CommerceProvider({ children, ...config }: SolidusProps) {
  return (
    <CoreCommerceProvider
      provider={solidusProvider}
      config={{ ...solidusConfig, ...config }}
    >
      {children}
    </CoreCommerceProvider>
  )
}

export const useCommerce = () => useCoreCommerce<SolidusProvider>()
