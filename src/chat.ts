import Elysia, { t } from 'elysia'
import { exhaustive } from 'exhaustive'
import { nanoid } from 'nanoid'
import { P, match } from 'ts-pattern'

import { CircularBuffer } from './lib'
import { measureLatency } from './lib/measure-latency'
import { messageModel } from './mongo'
import { ChatSchema, NewMessageResponse } from './schema'

type Message = typeof NewMessageResponse.static

const selfReturn = <T>(data: T): T => data

const messagesStore = {
	buffer: new CircularBuffer<Message>(5),
	addMessage(message: Message) {
		this.buffer.add(message)
	},
	clear() {
		this.buffer = new CircularBuffer(this.buffer.size)
	},
}

export const chat = (app: Elysia) => {
	return app.ws('/chat', {
		async open(ws) {
			const { room, username } = ws.data.query

			const messages = await messageModel.find()

			const publishData = {
				event: 'user_joined' as const,
				message: `${username} has joined the room`,
				username,
				messages,
			}

			ws.subscribe(room).publish(room, publishData)
		},
		async message(ws, message) {
			const { room } = ws.data.query

			const publishData = await match(message)
				.with({ event: 'new_message' }, async msg => {
					const newMessage = {
						...msg,
						// id: nanoid(),
						// date: new Date(),
					}

					const { result, latency } = await measureLatency(() =>
						messageModel.create(newMessage)
					)

					// const newMessageReturn = await messageModel.create(newMessage)

					console.log(latency)

					return result
				})
				.with(P.any, selfReturn)
				.exhaustive()

			ws.publish(room, publishData)
		},
		close(ws) {
			const { room, username } = ws.data.query

			ws.unsubscribe(room).publish(room, {
				event: 'user_left',
				message: `${username} has left the room`,
				username,
			})
		},
		schema: ChatSchema,
	})
}
