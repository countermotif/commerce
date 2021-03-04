import type { ProductNode } from '../../product/get-all-products'
import type { RecursivePartial } from './types'

export default function setProductLocaleMeta(
  node: any
) {
  if (node.localeMeta?.edges) {
    node.localeMeta.edges = node.localeMeta.edges.filter((edge) => {
      const { key, value } = edge?.node ?? {}
      if (key && key in node) {
        ;(node as any)[key] = value
        return false
      }
      return true
    })

    if (!node.localeMeta.edges.length) {
      delete node.localeMeta
    }
  }
}
