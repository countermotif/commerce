export default function filterEdges<T>(
  edges: (T | null | undefined)[] | null | undefined
) {
  console.log(edges)
  return edges?.filter((edge): edge is T => !!edge) ?? []
}
