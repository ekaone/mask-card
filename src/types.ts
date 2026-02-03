export type MaskChar = string;

export interface MaskCardOptions {
  /**
   * Character to use for masking
   * @default '*'
   */
  maskChar?: MaskChar;

  /**
   * Number of digits to show at the beginning
   * @default 0
   */
  unmaskedStart?: number;

  /**
   * Number of digits to show at the end
   * @default 4
   */
  unmaskedEnd?: number;

  /**
   * Maintain original spacing/formatting from input
   * @default false
   */
  preserveSpacing?: boolean;

  /**
   * Add spacing in output. Can be a number for uniform grouping or array for custom grouping
   * @example 4 → '**** **** **** 9012'
   * @example [4, 6, 5] → '**** ****** *****'
   */
  grouping?: number | number[];

  /**
   * Maintain original digit count in output
   * @default true
   */
  showLength?: boolean;

  /**
   * Validate if input looks like valid card number (13-19 digits)
   * @default false
   */
  validateInput?: boolean;
}

export type CardInput = string | number;

export type MaskedResult = string;
