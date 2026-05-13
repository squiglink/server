import { database, touch } from "./database.js";
import { describe, expect, it, vi } from "vitest";
import { insertBrand } from "./test_helper.factories.js";

describe(".touch", () => {
  it("updates the modification timestamp", async () => {
    const { createdBrand, updatedBrand } = await database
      .transaction()
      .execute(async (transaction) => {
        const createdBrand = await insertBrand(transaction);

        vi.useFakeTimers();
        vi.setSystemTime(new Date(createdBrand.updated_at).getTime() + 1);

        const updatedBrand = await transaction
          .updateTable("brands")
          .set(touch)
          .where("id", "=", createdBrand.id)
          .returningAll()
          .executeTakeFirstOrThrow();

        vi.useRealTimers();

        return { createdBrand, updatedBrand };
      });

    expect(new Date(updatedBrand.updated_at).getTime()).toBeGreaterThan(
      new Date(createdBrand.updated_at).getTime(),
    );
  });
});
