import fs from 'node:fs'

const seedPath = 'src/data/seed.ts'
const jpgNames = new Set(
  fs
    .readdirSync('public/situations')
    .filter((f) => f.endsWith('.jpg'))
    .map((f) => f.replace(/\.jpg$/, '')),
)

let seed = fs.readFileSync(seedPath, 'utf8')
const svgRefs = [...seed.matchAll(/\/situations\/([^.'"\\]+)\.svg/g)].map((m) => m[1])
const unique = [...new Set(svgRefs)]
const missing = unique.filter((n) => !jpgNames.has(n))

seed = seed.replace(/\/situations\/([^.'"\\]+)\.svg/g, (full, name) => {
  if (jpgNames.has(name)) return `/situations/${name}.jpg`
  return full
})

fs.writeFileSync(seedPath, seed)
console.log(
  JSON.stringify(
    {
      uniqueSvgRefs: unique.length,
      remappedToJpg: unique.length - missing.length,
      stillSvg: missing,
      jpgCount: jpgNames.size,
    },
    null,
    2,
  ),
)
