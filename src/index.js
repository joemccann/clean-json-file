const fs = require('fs').promises

const fetch = require('./http-client')

const isUrl = (url) => url.match(/^(?:\w+:)?\/\/(\S+)$/)

//
// Receives the path to a file
// Return's a JSON object
//
const readInputFileFromPath = async ({ path = '' }) => {
  if (!path) return { err: new Error('Missing `path` parameter') }

  let data = null

  try {
    data = JSON.parse(await fs.readFile(path))
  } catch (err) {
    return { err }
  }
  return { data }
}

//
// Receives a URL to a JSON file
// Return's a JSON object
//
const readInputFileFromURL = async ({ url = '' }) => {
  if (!url) return { err: new Error('Missing `url` parameter') }

  let data = null

  try {
    data = await fetch(url)
  } catch (err) {
    return { err }
  }
  return { data }
}

//
// Input is a full path to a JSON file or URL to a JSON file (required)
// Output is the full path to where the JSON file will be written (optional)
// Transform is the function to be called on the input data (required)
//
// Returns an error object or a data object which is the final,
// transformed JSON object.
//
module.exports = async ({
  input = '',
  output = '',
  transform = null
}) => {
  if (!input) return { err: new Error('Missing `input` parameter.') }
  if (!transform) return { err: new Error('Missing `transform` parameter.') }
  //
  // Ensure it's a function
  //
  if (!(transform && {}.toString.call(transform) === '[object Function]')) {
    return {
      err: new Error('Transform parameter is not a function.')
    }
  }
  let dirty = null

  //
  // Hydrate the "dirty" JSON object
  //
  if (isUrl(input)) {
    const { err, data } = await readInputFileFromURL({ url: input })

    if (err) return { err }

    dirty = data
  } else {
    const { err, data } = await readInputFileFromPath({ path: input })

    if (err) return { err }

    dirty = data
  }
  //
  // Transform the "dirty" JSON object
  // Your transform function needs a priori knowledge of
  // what the data structure is expected to be going in.
  //
  const { err, data: transformed } = transform(dirty)
  if (err) return { err }

  if (output) {
    try {
      await fs.writeFile(output, JSON.stringify(transformed))
    } catch (err) {
      return { err }
    }
  }
  return { data: transformed }
}
