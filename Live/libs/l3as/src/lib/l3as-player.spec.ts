import { L3asPlayer } from "./l3as-player";

describe("L3asPlayer", () => {
  it("should construct", () => {
    const l3asPlayer = new L3asPlayer();
    expect(l3asPlayer).toBeTruthy();
  });
});
