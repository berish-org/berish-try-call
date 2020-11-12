export interface ITryCallOptions {
  maxAttempts?: number;
  timeout?: number | [number, number];
  canThrow?: boolean;
}

export default function(options?: ITryCallOptions) {
  options = options || {};

  if (typeof options.maxAttempts === 'number') options.maxAttempts = options.maxAttempts > 0 ? options.maxAttempts : 1;
  else options.maxAttempts = 10;

  if (typeof options.timeout === 'number')
    options.timeout = options.timeout <= 0 ? [0, 0] : [options.timeout, options.timeout];
  else if (!Array.isArray(options.timeout) || !options.timeout.every(m => typeof m === 'number'))
    options.timeout = [0, 0];
  options.timeout = options.timeout.map(m => (typeof m !== 'number' || m <= 0 ? 0 : m)) as [number, number];

  options.canThrow = !!options.canThrow;

  return options;
}
