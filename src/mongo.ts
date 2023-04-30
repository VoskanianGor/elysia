import mongoose, { Schema, model } from 'mongoose'
import { Event, NewMessageResponse } from './schema'

const connectDB = async () => {
	await mongoose.connect(
		'mongodb://mongo:sxhWSlsqCgrlnLw8qWp9@containers-us-west-71.railway.app:5816',
		{}
	)

	const db = mongoose.connection

	db.on('error', console.error.bind(console, 'connection error:'))
	db.once('open', () => {
		console.log('Connected to MongoDB')
	})

	return db
}

export const db = connectDB()

const PostSchema = new Schema({
	title: String,
	body: String,
	published: Boolean,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	createdAt: { type: Date, default: Date.now },
})

const UserSchema = new Schema({
	username: String,
	password: String,
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Post',
		},
	],
})

type Message = Omit<typeof NewMessageResponse.static, 'id'>

const MessageSchema = new Schema<Message>({
	event: {
		type: String,
		enum: Event.new_message,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	username: String,
	message: String,
})

const postModel = model('Post', PostSchema)
const userModel = model('User', UserSchema)
const messageModel = model('Message', MessageSchema)

export { postModel, userModel, messageModel }
