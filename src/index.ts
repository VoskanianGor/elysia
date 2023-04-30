// import { logger } from '@bogeychan/elysia-logger'
import { cors } from '@elysiajs/cors'
import { log } from 'console'
import { Elysia, t, ws } from 'elysia'

import { chat } from './chat'
import { measureLatency } from './lib/measure-latency'
import { postModel, userModel } from './mongo'
import { getXataClient } from './xata'

const port = parseInt(process.env.PORT || '8080')
const xata = getXataClient()

export const app = new Elysia()
	.use(cors())
	.use(ws())
	.use(chat)
	.get('/', async () => {
		const { result, latency } = await measureLatency(() =>
			postModel.find().populate('author', 'username').exec()
		)

		return {
			index: { ...result, latency },
		}
	})
	.get('/posts', async () => {
		const startTime = process.hrtime()
		const record = await xata.db.Posts.read('rec_ch6lavkf1735sb693q8g')
		const endTime = process.hrtime(startTime)
		const elapsedTime = (endTime[0] * 1e9 + endTime[1]) / 1e6
		return {
			latency: `${elapsedTime.toFixed(2)} ms`,
			posts: record,
		}
	})
	// .get('/posts2', async () => {
	// 	const startTime = process.hrtime()
	// 	const records = await xata.db.Posts2.select(['*', 'author.*']).getAll()
	// 	const endTime = process.hrtime(startTime)
	// 	const elapsedTime = (endTime[0] * 1e9 + endTime[1]) / 1e6
	// 	return {
	// 		latency: `${elapsedTime.toFixed(2)} ms`,
	// 		posts: records,
	// 	}
	// })
	.listen(port)

log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
