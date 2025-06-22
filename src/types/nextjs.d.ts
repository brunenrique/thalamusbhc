import 'next';

export {};

declare module 'next' {
  export interface NextConfig {
    allowedDevOrigins?: string[];
  }
}
