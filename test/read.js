/* global Blob */

const test = require('tape')
const FileReadStream = require('../read.js')

test('read stream (3MB blob)', function (t) {
  testReadStream(t, 3 * 1000 * 1000)
})

test('read stream (30MB blob)', function (t) {
  testReadStream(t, 30 * 1000 * 1000)
})

test('read stream (300MB blob)', function (t) {
  testReadStream(t, 300 * 1000 * 1000)
})

function testReadStream (t, size) {
  t.plan(1)
  const data = Buffer.alloc(size).fill('abc')
  const blob = new Blob([data.buffer])

  const stream = new FileReadStream(blob)
  stream.on('error', function (err) {
    console.error(err)
    t.error(err.message)
  })

  const chunks = []
  stream.on('data', function (chunk) {
    chunks.push(chunk)
  })

  stream.on('end', function () {
    const combined = Buffer.concat(chunks)
    t.deepEqual(combined, data)
  })
}
