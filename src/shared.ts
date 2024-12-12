export type Environment = 'development' | 'production';

export const getEnv = (): Environment => {
  if (process.env.NODE_ENV === 'development') {
    return "development"
  }
  return "production"
}
