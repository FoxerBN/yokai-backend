import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
  it("should return 200 and a message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toHaveProperty("message", "Hi there!");
  });
});
