import 'next'

declare module 'next' {
  interface ExperimentalConfig {
    allowedDevOrigins?: string[]
  }
}
