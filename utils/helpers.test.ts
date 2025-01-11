import { getLocalISOString } from "./helpers";

describe("getLocalISOString", () => {
  it('should return a string in the format "YYYY-MM-DD HH:mm:ss"', () => {
    const date = new Date("2023-01-01");
    const localISOString = getLocalISOString(date);
    expect(localISOString).toBe("2023-01-01 00:00:00");
  });
});
