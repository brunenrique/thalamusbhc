export class ServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message)
    this.name = 'ServiceError'
  }
}
