const test = require('tape')
const rm = require('./rm')

const clean = require('../src')

const byUrl = require('../src/http-client')

const URL = 'https://covid19sentiment.blob.core.windows.net/covid-19-sentiment-container/merged.json'
const FILE = [__dirname, 'input.json'].join('/')
const OUTPUT = [__dirname, 'clean.json'].join('/')

const TRANSFORM = (data) => {
  try {
    const ret = Array.from(data, article => {
      const {
        href,
        messageId,
        timestamp,
        title,
        sentiment,
        positive,
        negative,
        neutral
      } = article
      return {
        href,
        messageId,
        timestamp,
        title,
        sentiment,
        positive,
        negative,
        neutral
      }
    })
    return { data: ret }
  } catch (err) {
    return { err }
  }
}

const finished = async () => {
  //
  // Delete the output file
  //
  const { err, data } = await rm({ path: OUTPUT })
  if (err) console.error(err)
  console.log(data)
  console.log('FINISHED.')
}

test.onFinish(finished)

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - http fetch', async t => {
  let d = null
  try {
    d = await byUrl(URL)
  } catch (err) {
    console.error(err)
  }
  t.ok(d)
  t.end()
})

test('fail - http fetch', async t => {
  let d = null
  try {
    d = await byUrl('https://foo.com/foo.json')
  } catch (err) {
    t.ok(err)
  }
  t.ok(!d)
  t.end()
})

test('pass - clean file via local file and write to file option', async t => {
  const { err, data } = await clean({
    input: FILE,
    output: OUTPUT,
    transform: TRANSFORM
  })
  t.ok(!err)
  t.ok(data)
  await finished()
  t.end()
})

test('pass - clean file via local file but do not write.', async t => {
  const { err, data } = await clean({
    input: FILE,
    transform: TRANSFORM
  })
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('pass - clean file via URL and write to file option', async t => {
  const { err, data } = await clean({
    input: URL,
    output: OUTPUT,
    transform: TRANSFORM
  })
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('pass - clean file via URL but do not write', async t => {
  const { err, data } = await clean({
    input: URL,
    transform: TRANSFORM
  })
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('fail - clean file via file but do not write', async t => {
  const { err, data } = await clean({
    input: URL,
    transform: null
  })
  t.ok(err)
  t.ok(!data)
  t.end()
})

test('fail - clean file via URL but do not write', async t => {
  const { err, data } = await clean({
    input: URL,
    transform: null
  })
  t.ok(err)
  t.ok(!data)
  t.end()
})
