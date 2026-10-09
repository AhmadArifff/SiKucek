/**
 * Result Pattern Implementation for SiKucek Laundry System
 * Enables robust error handling without unhandled exceptions or nested try-catch blocks.
 */

export type Result<T, E = string> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  readonly isOk = true;
  readonly isFail = false;

  constructor(public readonly value: T) {}

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }
}

export class Err<T, E> {
  readonly isOk = false;
  readonly isFail = true;

  constructor(public readonly error: E) {}

  unwrap(): T {
    throw new Error(`Tried to unwrap Err: ${JSON.stringify(this.error)}`);
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }
}

export const Result = {
  ok<T, E = string>(value: T): Result<T, E> {
    return new Ok(value);
  },

  fail<T = never, E = string>(error: E): Result<T, E> {
    return new Err(error);
  },
};
