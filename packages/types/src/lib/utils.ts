export type PartialRecord<K extends PropertyKey, T> = Partial<Record<K, T>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;

export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Omits properties from a type while preserving discriminated unions
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitImproved<T, K extends keyof T> = { [P in keyof T as Exclude<P, K & keyof any>]: T[P] };

/**
 * Pick properties from a type while preserving discriminated unions
 */
export type PickImproved<T, K extends keyof T> = {
  [P in keyof T as K & P]: T[P];
};
