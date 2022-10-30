import { FetchEnsNameArgs, FetchEnsNameResult, fetchEnsName } from '@wagmi/core'

import { QueryConfig, QueryFunctionArgs } from '../../types'
import { useChainId, useQuery } from '../utils'

export type UseEnsNameArgs = Partial<FetchEnsNameArgs>
export type UseEnsNameConfig = QueryConfig<FetchEnsNameResult, Error>

type QueryKeyArgs = UseEnsNameArgs
type QueryKeyConfig = Pick<UseEnsNameConfig, 'cacheKey'>

function queryKey({
  address,
  chainId,
  cacheKey,
}: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'ensName', address, chainId, cacheKey }] as const
}

const queryFn = ({
  queryKey: [{ address, chainId }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error('address is required')
  return fetchEnsName({ address, chainId })
}

export function useEnsName({
  address,
  cacheTime,
  chainId: chainId_,
  cacheKey,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseEnsNameArgs & UseEnsNameConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(queryKey({ address, chainId, cacheKey }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && address && chainId),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
