import { getLocalISOString } from "./helpers";

describe("getLocalISOString", () => {
  it('should return a string in the format "YYYY-MM-DD HH:mm:ss"', () => {
    const date = new Date("2023-01-01");
    const localISOString = getLocalISOString(date);
    expect(localISOString).toBe("2022-12-31 18:00:00");
  });
});
