import * as getCurrentUserModule from "../services/get_current_user.js";
import { authenticationOptionalMiddleware } from "./authentication_optional_middleware.js";
import { describe, expect, it, vi } from "vitest";

vi.mock("../services/get_current_user.js");

describe(".authenticationOptionalMiddleware", () => {
  it("sets the current user context variable", async () => {
    const next = vi.fn();
    const context: any = {
      req: { header: vi.fn().mockReturnValue("valid") },
      set: vi.fn(),
    };
    const currentUser = { id: "placeholder" };
    vi.mocked(getCurrentUserModule.getCurrentUser).mockResolvedValue(currentUser as any);

    await authenticationOptionalMiddleware(context, next);

    expect(context.set).toHaveBeenCalledWith("currentUser", currentUser);
  });
});
