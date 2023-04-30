class CircularBuffer<T> {
	public size: number
	private buffer: T[]
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

	isEmpty(): boolean {
		return this.start === this.end
	}
}

export default CircularBuffer
