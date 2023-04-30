// Solution 1: Using Array.shift()
const messagesStore1 = {
	messages: [],
	maxSize: 1000,
	addMessage(message) {
		if (this.messages.length >= this.maxSize) {
			this.messages.shift()
		}
		this.messages.push(message)
	},
	clear() {
		this.messages = []
	},
}

// Solution 2: Using Circular Buffer
class CircularBuffer<T> {
	private buffer: T[]
	private size: number
	private start: number
	private end: number

	constructor(size: number) {
		this.buffer = new Array<T>(size)
		this.size = size
		this.start = 0
		this.end = 0
	}

	add(item: T): void {
		this.buffer[this.end] = item
		this.end = (this.end + 1) % this.size

		if (this.start === this.end) {
			this.start = (this.start + 1) % this.size
		}
	}

	toArray(): T[] {
		if (this.start < this.end) {
			return this.buffer.slice(this.start, this.end)
		} else {
			return this.buffer
				.slice(this.start)
				.concat(this.buffer.slice(0, this.end))
		}
	}
}

const messagesStore2 = {
	messages: new CircularBuffer(1000),
	addMessage(message) {
		this.messages.add(message)
	},
	clear() {
		this.messages = new CircularBuffer(this.messages.size)
	},
}

const iterations = 10_000_000 // Number of iterations for the performance test

// Performance test for Solution 1
const t1Start = performance.now()
for (let i = 0; i < iterations; i++) {
	messagesStore1.addMessage({ text: `Message ${i}` })
}
const t1End = performance.now()
console.log(`Solution 1: ${t1End - t1Start} ms`)

// Performance test for Solution 2
const t2Start = performance.now()
for (let i = 0; i < iterations; i++) {
	messagesStore2.addMessage({ text: `Message ${i}` })
}
const t2End = performance.now()
console.log(`Solution 2: ${t2End - t2Start} ms`)
