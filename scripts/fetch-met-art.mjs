#!/usr/bin/env node
/**
 * Downloads pinned CC0 artworks from The Met Open Access API into public/art/
 * and writes an attribution manifest to src/data/art.json. Manual step, not
 * part of the build. Behind a TLS-intercepting proxy set NODE_EXTRA_CA_CERTS.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const API = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'
const root = new URL('..', import.meta.url).pathname
const outDir = path.join(root, 'public/art')
const manifestPath = path.join(root, 'src/data/art.json')

const { objects } = JSON.parse(await readFile(path.join(root, 'scripts/met-objects.json'), 'utf8'))
await mkdir(outDir, { recursive: true })

const manifest = []
for (const { id, role, hint } of objects) {
    const res = await fetch(API + id)
    if (!res.ok) { console.error(`✗ ${id} ${hint}: HTTP ${res.status}`); continue }
    const obj = await res.json()
    if (!obj.isPublicDomain) { console.error(`✗ ${id} is not public domain, skipping`); continue }
    const url = obj.primaryImageSmall || obj.primaryImage
    if (!url) { console.error(`✗ ${id} has no image`); continue }
    const img = await fetch(url)
    if (!img.ok) { console.error(`✗ ${id} image: HTTP ${img.status}`); continue }
    const file = `met-${id}.jpg`
    await writeFile(path.join(outDir, file), Buffer.from(await img.arrayBuffer()))
    manifest.push({
        id,
        role,
        src: `/art/${file}`,
        title: obj.title,
        culture: obj.culture,
        period: obj.period,
        date: obj.objectDate,
        medium: obj.medium,
        artist: obj.artistDisplayName || null,
        objectURL: obj.objectURL,
        credit: `${obj.title}, ${obj.objectDate}. The Metropolitan Museum of Art, Open Access (CC0).`,
        license: 'CC0 1.0',
        fetchedAt: new Date().toISOString().slice(0, 10),
    })
    console.log(`✓ ${file}  ${obj.title}`)
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`wrote ${manifest.length} entries to src/data/art.json`)
