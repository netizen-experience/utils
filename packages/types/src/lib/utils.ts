/**
 * Creates a type that represents a partial record with keys of type K and values of type T.
 * @example
 * type PartialUser = PartialRecord<'name' | 'age', string>;
 * // Equivalent to: { name?: string; age?: string }
 */
export type PartialRecord<K extends PropertyKey, T> = Partial<Record<K, T>>;

/**
 * Creates a type by making the specified keys K in T optional.
 * @example
 * interface User {
 *   name: string;
 *   age: number;
 * }
 * type PartialUser = PartialBy<User, 'age'>;
 * // Equivalent to: { name: string; age?: number }
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Creates a type by making the specified keys K in T required.
 * @example
 * interface User {
 *   name?: string;
 *   age?: number;
 * }
 * type RequiredUser = RequiredBy<User, 'name'>;
 * // Equivalent to: { name: string; age?: number }
 */
export type RequiredBy<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;

/**
 * Creates a type that represents a non-empty array of type T.
 * @example
 * type NonEmptyStringArray = NonEmptyArray<string>;
 * // Equivalent to: [string, ...string[]]
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Omits properties from a type while preserving discriminated unions
 * @example
 * interface User {
 *   name: string;
 *   age: number;
 *   email: string;
 * }
 * type OmittedUser = OmitImproved<User, 'email'>;
 * // Equivalent to: { name: string; age: number }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitImproved<T, K extends keyof T> = { [P in keyof T as Exclude<P, K & keyof any>]: T[P] };

/**
 * Pick properties from a type while preserving discriminated unions
 * @example
 * interface User {
 *   name: string;
 *   age: number;
 *   email: string;
 * }
 * type PickedUser = PickImproved<User, 'name' | 'email'>;
 * // Equivalent to: { name: string; email: string }
 */
export type PickImproved<T, K extends keyof T> = {
  [P in keyof T as K & P]: T[P];
};
