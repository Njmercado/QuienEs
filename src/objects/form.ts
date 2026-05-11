export type FormState<T> = {
  [K in keyof T]: {
    value: T[K],
    error?: boolean
  }
}

export type FormError<T extends object> = {
  [K in keyof T]: boolean
}
