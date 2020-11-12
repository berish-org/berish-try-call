import prepareOptions, { ITryCallOptions } from './options';

function setTimeoutPromise(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function randomInteger(min: number, max: number) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

export async function tryCall<T>(func: () => T | Promise<T>, options?: ITryCallOptions) {
  options = prepareOptions(options);
  const { canThrow, maxAttempts, timeout: timeoutRaw } = options;

  const timeout: [number, number] = Array.isArray(timeoutRaw) ? timeoutRaw : [timeoutRaw, timeoutRaw];

  let currentAttemp = 0;
  let currentError: any = null;
  do {
    try {
      const result = await func();
      return result;
    } catch (err) {
      currentError = err;
      const currentTimeout = timeout[0] === timeout[1] ? timeout[0] : randomInteger(timeout[0], timeout[1]);
      if (currentTimeout) await setTimeoutPromise(currentTimeout);
    } finally {
      currentAttemp++;
    }
  } while (currentAttemp < maxAttempts);
  if (!canThrow) return void 0;
  throw currentError;
}
