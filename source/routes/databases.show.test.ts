import application from "../application.js";
import { database } from "../database.js";
import { describe, expect, it } from "vitest";
import { insertDatabase } from "../test_helper.factories.js";

describe("GET /databases/:id", () => {
  it("responds with success and returns the database", async () => {
    const db = await database.transaction().execute(async (transaction) => {
      return await insertDatabase(transaction);
    });

    const body = {
      created_at: db.created_at,
      id: db.id,
      kind: db.kind,
      path: db.path,
      updated_at: db.updated_at,
      user_id: db.user_id,
    };

    const response = await application.request(`/databases/${db.id}`);
    expect(await response.json()).toEqual(body);
    expect(response.ok).toBe(true);
  });
});
