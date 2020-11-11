import {range} from './utils';

describe("range", () => {
	test("Upwards, default step", () => {
		expect(range(0, 5)).toStrictEqual([0, 1, 2, 3, 4]);
	});
	
	test("Downwards, default step", () => {
		expect(range(2, -3)).toStrictEqual([2, 1, 0, -1, -2]);
	});

	test("Upwards, non-default step", () => {
		expect(range(14, 30, 6)).toStrictEqual([14, 20, 26]);
	});

	test("Downwards, non-default step", () => {
		expect(range(50, -80, 20)).toStrictEqual([50, 30, 10, -10, -30, -50, -70]);
	});

	test("Empty", () => {
		expect(range(50, 50)).toStrictEqual([]);
	});
});