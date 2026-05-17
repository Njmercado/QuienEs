import type { ReactNode } from 'react'
import { PageLoading } from './PageLoading'
import { PageError } from './PageError'

export interface ApiStatusHandlerProps {
  isLoading: boolean
  isError: boolean
  hasData: boolean
  loadingMessage?: string
  errorMessage?: string
  errorCode?: string
  children: ReactNode
}

export function ApiStatusHandler({
  isLoading,
  isError,
  hasData,
  loadingMessage,
  errorMessage,
  errorCode,
  children,
}: ApiStatusHandlerProps) {
  if (isLoading) {
    return <PageLoading message={loadingMessage} />
  }

  if (isError || !hasData) {
    return <PageError message={errorMessage} code={errorCode} />
  }

  return <>{children}</>
}
