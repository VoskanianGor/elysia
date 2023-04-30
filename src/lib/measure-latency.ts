interface LatencyResult<T> {
	result: T
	latency: string
}

export async function measureLatency<T>(
	fn: () => Promise<T>
): Promise<LatencyResult<T>> {
	const startTime = process.hrtime()
	const result = await fn()
	const endTime = process.hrtime(startTime)
	const elapsedTime = (endTime[0] * 1e9 + endTime[1]) / 1e6
	return {
		result,
		latency: `${elapsedTime.toFixed(2)} ms`,
	}
}
