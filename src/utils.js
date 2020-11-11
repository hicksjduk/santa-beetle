export function randInt(limit) {
	return Math.floor(Math.random() * limit);
}

export function range(startInclusive, endExclusive, step = 1) {
	if (step < 1)
		throw new Error("Step must be more than 0");
	const count = Math.ceil(Math.abs(startInclusive - endExclusive) / step);
	const increment = step * Math.sign(endExclusive - startInclusive);
	return Array.from({length: count}, (x, i) => startInclusive + i * increment);
}