export type ErrorMsg = {
  error?: unknown
  msg: string
}

export function createErrorFactory<T extends new (err: ErrorMsg) => any>(Self: T) {
  return (msg: string) => (error?: unknown) => new Self({ error, msg })
}
