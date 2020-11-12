# @berish/try-call

A method that allows a function to be called in multiple attempts. Supports different retry times, number of retries, and the ability to throw an error

## Installation

```
$ npm install @berish/try-call --save
```

or

```
$ yarn add @berish/try-call
```

**Supports typescript**

## Use case

```typesciprt
import tryCall from '@berish/try-call';

const result = await tryCall(sendRequest, {
  canThrow: true,
  maxAttempts: 10,
  timeout: [100, 1000]
})
```
