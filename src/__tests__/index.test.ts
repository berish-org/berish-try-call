import prepareOptions from '../options';
import { tryCall } from '../tryCall';

describe('try call test', () => {
  test('prepare options', done => {
    expect(prepareOptions()).toEqual({
      canThrow: false,
      maxAttempts: 10,
      timeout: [0, 0],
    });

    expect(
      prepareOptions({
        canThrow: true,
        maxAttempts: -1,
        timeout: -1000,
      }),
    ).toEqual({
      canThrow: true,
      maxAttempts: 1,
      timeout: [0, 0],
    });

    expect(
      prepareOptions({
        canThrow: true,
        maxAttempts: 5,
        timeout: 1000,
      }),
    ).toEqual({
      canThrow: true,
      maxAttempts: 5,
      timeout: [1000, 1000],
    });

    expect(
      prepareOptions({
        canThrow: true,
        timeout: [-1000, -1000],
      }),
    ).toEqual({
      canThrow: true,
      maxAttempts: 10,
      timeout: [0, 0],
    });

    done();
  });

  test('tryCall default', async done => {
    let count = 0;
    const testFunc = () => {
      count++;
      return count;
    };
    const result = await tryCall(testFunc, {
      canThrow: false,
      maxAttempts: 5,
      timeout: 500,
    });
    expect(count).toBe(1);
    expect(result).toBe(1);

    done();
  });

  test('tryCall default async', async done => {
    let count = 0;
    const testFunc = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      count++;
      return count;
    };
    const result = await tryCall(testFunc, {
      canThrow: false,
      maxAttempts: 5,
      timeout: 500,
    });
    expect(count).toBe(1);
    expect(result).toBe(1);

    done();
  });

  test('tryCall error', async done => {
    let count = 0;
    const testFunc = async () => {
      count++;
      throw '123';
      return 0;
    };
    const result = await tryCall(testFunc, {
      canThrow: false,
      maxAttempts: 5,
      timeout: 100,
    });
    expect(result).toBe(void 0);
    expect(count).toBe(5);

    done();
  });

  test('tryCall error canThrow', async done => {
    let count = 0;
    const testFunc = async () => {
      count++;
      throw '123';
      return 0;
    };
    try {
      const result = await tryCall(testFunc, {
        canThrow: true,
        maxAttempts: 5,
        timeout: 100,
      });
    } catch (err) {
      expect(err).toBe('123');
      expect(count).toBe(5);
    }

    done();
  });
});
