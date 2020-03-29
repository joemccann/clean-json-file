# 🛀🏼 Clean JSON File

Take a dirty JSON file and clean it by removing properties and
values that aren't useful or simply need tidying up.

## Requirements

Node.js version 12 or higher

## Installation

```sh
npm i -S joemccann/clean-json-file
```

## Usage

`input`:  path to the JSON file or a URL (required)

`output`: the path to the clean JSON file (optional)

`transformer`: function to clean/trim/alter the input (required)

```js
const clean = require('clean-json-file')

const URL = 'https://path-to-some-file.com/foo.json'

const FILE = [__dirname, 'input.json'].join('/')

const OUTPUT = [__dirname, 'clean.json'].join('/')

const TRANSFORM = (data) => {
  try {
    const ret = Array.from(data, article => {
      const {
        href,
        timestamp
      } = article
      return {
        href,
        messageId
      }
    })
    return { data: ret }
  } catch (err) {
    return { err }
  }
}

const { err, data } = await clean({
  input: URL,
  output: OUTPUT,
  transform: TRANSFORM
})

if (err) return { err }
return { data }  // cleaned/transformed JSON object
```

> NOTE: The transformer function expects you to know a priori the data
structure it is being passed, be it an object or an array, etc.

## Tests

```sh
npm i -D
npm test
```

## License

MIT
