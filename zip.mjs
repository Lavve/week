import { createWriteStream } from 'node:fs'
import archiver from 'archiver'

const output = createWriteStream('week.zip')
const archive = archiver('zip', { zlib: { level: 9 } })

archive.on('error', (error) => {
  throw error
})

output.on('close', () => {
  console.log(`Created week.zip (${archive.pointer()} bytes)`)
})

archive.pipe(output)
archive.directory('dist', false)
await archive.finalize()
