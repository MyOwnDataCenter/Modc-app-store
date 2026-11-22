// The Modc App Store's checks, run on small stores built in a temporary folder.
import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises'
import os from 'node:os'
import {dirname, join} from 'node:path'
import {after, test} from 'node:test'
import {fileURLToPath} from 'node:url'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'validate.mjs')
const root = await mkdtemp(join(os.tmpdir(), 'modc-'))
after(() => rm(root, {recursive: true, force: true}))

const LISTING = (id, {port = 3000, extra = ''} = {}) => `manifestVersion: 1
id: ${id}
name: "App ${id}"
tagline: "Does a thing"
icon: https://example.com/${id}.png
category: files
version: "1.0"
port: ${port}
web:
  service: web
  port: 80
description: >-
  Does a thing.
developer: "Someone"
website: https://example.com
repo: https://github.com/someone/${id}
submitter: "someone"
${extra}`
const COMPOSE = (svc = '    image: nginx:1.27\n') => `services:\n  web:\n${svc}    volumes:\n      - \${APP_DATA_DIR}/data:/data\n`

let n = 0
async function store(apps) {
	const dir = join(root, `s${n++}`)
	await mkdir(dir)
	for (const [name, files] of Object.entries(apps)) {
		await mkdir(join(dir, name))
		if (files.compose !== undefined) await writeFile(join(dir, name, 'docker-compose.yml'), files.compose)
		if (files.listing !== undefined) await writeFile(join(dir, name, 'omarchy-app.yml'), files.listing)
	}
	return dir
}
const run = (dir, flags = []) => {
	const r = spawnSync(process.execPath, [SCRIPT, '--root', dir, ...flags], {encoding: 'utf8', env: {...process.env, GITHUB_ACTIONS: ''}})
	return {code: r.status, out: r.stdout + r.stderr}
}
const check = async (apps, flags) => run(await store(apps), flags)

test('a complete, pinned app passes', async () => {
	const r = await check({notes: {compose: COMPOSE(), listing: LISTING('notes')}})
	assert.equal(r.code, 0, r.out)
	assert.match(r.out, /1 apps checked: 0 errors/)
})

test('an image without a fixed version fails', async () => {
	for (const image of ['nginx', 'nginx:latest', 'ghcr.io/x/y']) {
		const r = await check({notes: {compose: COMPOSE(`    image: ${image}\n`), listing: LISTING('notes')}})
		assert.equal(r.code, 1, image)
		assert.match(r.out, /isn't pinned/)
	}
	const digest = await check({notes: {compose: COMPOSE('    image: nginx@sha256:abc\n'), listing: LISTING('notes')}})
	assert.equal(digest.code, 0, digest.out)
})

test('the container engine socket is refused, even with a reason', async () => {
	const compose = 'services:\n  web:\n    image: nginx:1.27\n    volumes:\n      - /var/run/docker.sock:/var/run/docker.sock\n'
	const r = await check({notes: {compose, listing: LISTING('notes', {extra: 'extraAccess: "it manages containers"\n'})}})
	assert.equal(r.code, 1)
	assert.match(r.out, /container engine's socket/)
})

test('extra access needs a written reason', async () => {
	const compose = COMPOSE('    image: nginx:1.27\n    network_mode: host\n    privileged: true\n')
	const without = await check({notes: {compose, listing: LISTING('notes')}})
	assert.equal(without.code, 1)
	assert.match(without.out, /extraAccess/)
	const withReason = await check({notes: {compose, listing: LISTING('notes', {extra: 'extraAccess: "It finds smart-home devices on your network."\n'})}})
	assert.equal(withReason.code, 0, withReason.out)
})

test('building from source is not supported', async () => {
	const r = await check({notes: {compose: 'services:\n  web:\n    build: .\n', listing: LISTING('notes')}})
	assert.equal(r.code, 1)
	assert.match(r.out, /build: isn't supported|needs an image/)
})

test('who submitted it, the project and its links are required', async () => {
	const listing = LISTING('notes').replace(/submitter: .*\n/, '').replace('website: https://example.com', 'website: http://example.com')
	const r = await check({notes: {compose: COMPOSE(), listing}})
	assert.equal(r.code, 1)
	assert.match(r.out, /submitter is missing/)
	assert.match(r.out, /website should be an https/)
})

test('two apps cannot share a port, and low ports are refused', async () => {
	const dup = await check({a: {compose: COMPOSE(), listing: LISTING('a')}, b: {compose: COMPOSE(), listing: LISTING('b')}})
	assert.equal(dup.code, 1)
	assert.match(dup.out, /share port 3000/)
	const low = await check({a: {compose: COMPOSE(), listing: LISTING('a', {port: 80})}})
	assert.match(low.out, /below 1024/)
})

test('an id or port the official store already uses is refused', async () => {
	const official = await store({nextcloud: {compose: COMPOSE(), listing: LISTING('nextcloud', {port: 8180})}})
	const sameId = await check({nextcloud: {compose: COMPOSE(), listing: LISTING('nextcloud', {port: 4000})}}, ['--official', official])
	assert.match(sameId.out, /already an app in the official store/)
	const samePort = await check({notes: {compose: COMPOSE(), listing: LISTING('notes', {port: 8180})}}, ['--official', official])
	assert.match(samePort.out, /already used by nextcloud/)
	const fine = await check({notes: {compose: COMPOSE(), listing: LISTING('notes', {port: 4000})}}, ['--official', official])
	assert.equal(fine.code, 0, fine.out)
})

test('the id must match the folder', async () => {
	const r = await check({notes: {compose: COMPOSE(), listing: LISTING('other')}})
	assert.equal(r.code, 1)
	assert.match(r.out, /must match/)
})
