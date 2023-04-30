import { Event } from '../schema'
import { app } from '../src'

export type App = typeof app

export type EventType = keyof typeof Event
