const fs = require('fs').promises

module.exports = async ({ path = '' }) => {
  if (!path) return { err: new Error('Missing `path` parameter.') }

  try {
    await fs.unlink(path)
  } catch (err) {
    return { err }
  }
  return { data: 'ok' }
}
