export const NOT_IN_PROD = process.env.NODE_ENV !== "production"
export const IN_DEV = process.env.NODE_ENV === "development"
export const inDev = (): boolean => IN_DEV
