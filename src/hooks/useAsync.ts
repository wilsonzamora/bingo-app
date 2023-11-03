import * as React from 'react'

export type AsyncStatus = 'idle' | 'resolved' | 'rejected' | 'pending'
const cache = new Map();
const ONE_MINUTE = 60000 //MILLISECONDS
const X_MINUTES = 30 * ONE_MINUTE // x mins in milliseconds...

setInterval(() => {
  if (typeof window !== "undefined") {
    //@ts-ignore
    if (!window._cache) {
      //@ts-ignore
      window._cache = cache
    }
  }
  const currentTime = new Date().getTime()
  //@ts-ignore
  for (let [ key, value ] of cache.entries()) {
    if (currentTime > value.expireIn) {
      console.log('delete cache::', key)
      cache.delete(key)
    }
  }
}, 5000);

type InputActions = {
  onSuccess?: (data: any) => void
  onStart?: () => void
  onFinish?: () => void
  onError?: (error: any) => void
}
type AsyncBody = {
  status: AsyncStatus
  data: any | undefined
  error: any | undefined
  finsished: 'finished' | 'no-finished'
}

type RunConfig = {
  cacheKey?: string
  refetch?: () => Promise<any>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  onFinish?: () => void
  skipErrorWhenStatus?: number
}
function useSafeDispatch(dispatch: any) {
  const mounted = React.useRef(false)

  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    //@ts-ignore
    (...args) => (mounted.current ? dispatch(...args) : undefined),
    [ dispatch ]
  )
}

const defaultInitialState: AsyncBody = {
  status: 'idle',
  data: undefined,
  error: undefined,
  finsished: 'no-finished',
}

export function useAsync(initialState?: InputActions) {

  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [ { status, data, error, finsished, refetch }, setState ] = React.useReducer(
    (s: any, a: any) => ({ ...s, ...a }),
    initialStateRef.current
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(
    (data: any) => safeSetState({ data, status: 'resolved' }),
    [ safeSetState ]
  )
  const setError = React.useCallback(
    (error: any) => safeSetState({ error, status: 'rejected' }),
    [ safeSetState ]
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [ safeSetState ]
  )

  const run = React.useCallback(
    async (promise: any, config?: RunConfig) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        )
      }
      if (config?.refetch) {
        safeSetState({ refetch: config?.refetch })
      }
      setError(undefined)
      safeSetState({ status: 'pending' })
      safeSetState({ finsished: 'no-finished' })
      initialState?.onStart?.()
      try {

        if (config?.cacheKey && cache.has(config?.cacheKey)) {
          const data = cache.get(config?.cacheKey);
          setData({ ...data })
          initialState?.onSuccess?.(data)
          return data
        } else {
          const data = await promise
          //set cache if active
          const expireIn = new Date().getTime() + X_MINUTES
          config?.cacheKey && cache.set(config?.cacheKey, { ...data, expireIn });
          setData(data)
          initialState?.onSuccess?.(data)
          config?.onSuccess?.(data)
          return data
        }

      } catch (error: any) {
        safeSetState({ status: 'rejected' })
        // in case when we need to skipt any status like 401 unauthorized for instance
        if (config?.skipErrorWhenStatus === error?.response?.status) {
          initialState?.onError?.(error)
          config?.onError?.(error)
          return error
        }

        const errorMsg =
          typeof error === 'object' ? JSON.stringify(error) : error
        setError(errorMsg)
        initialState?.onError?.(error)
        config?.onError?.(error)
        return Promise.reject(error)
      } finally {
        safeSetState({ finsished: 'finished' })
        initialState?.onFinish?.()
        config?.onFinish?.()
      }
    },
    [ safeSetState, setData, setError ]
  )


  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',
    isFinsished: finsished === 'finished',

    setData,
    setError,
    error,
    status,
    data,
    cache,
    run,
    reset,
    refetch
  }
}
