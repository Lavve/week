import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { build } from 'esbuild'
import { minify } from 'html-minifier-terser'

const dist = 'dist'

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

for (const dir of ['icons', 'weeks']) {
  cpSync(dir, `${dist}/${dir}`, { recursive: true })
}

cpSync('manifest.json', `${dist}/manifest.json`)
mkdirSync(`${dist}/css`, { recursive: true })
cpSync('css/MuseoModerno.woff2', `${dist}/css/MuseoModerno.woff2`)
mkdirSync(`${dist}/js`, { recursive: true })

for (const file of ['background.js', 'js/week.js', 'js/week-utils.js']) {
  await build({
    entryPoints: [file],
    outfile: `${dist}/${file}`,
    minify: true,
    bundle: false,
    legalComments: 'none',
  })
}

await build({
  entryPoints: ['css/popup.css'],
  outfile: `${dist}/css/popup.css`,
  minify: true,
})

const html = readFileSync('popup.html', 'utf8')
const minHtml = await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: false,
  minifyJS: false,
  keepClosingSlash: true,
})
writeFileSync(`${dist}/popup.html`, minHtml)

console.log('Built to dist/')
