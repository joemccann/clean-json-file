//
// Case-specific, lightweight HTTP client. Do not use for anything
// beyond this module.
//

const http = require('http')
const https = require('https')

module.exports = async (url) => {
  return new Promise((resolve, reject) => {
    if (!url) reject(new Error('Missing `url` paramter.'))

    const method = url.startsWith('https') ? https.get : http.get

    const req = method(url, res => {
      let body = ''
      res.setEncoding('utf8')

      res.on('data', data => {
        body += data
      })

      res.on('end', () => {
        try {
          body = JSON.parse(body)
        } catch (error) {
          return reject(error)
        }
        return resolve(body)
      })
      res.on('error', reject)
    })
    req.on('error', reject)
    req.end()
  })
}
