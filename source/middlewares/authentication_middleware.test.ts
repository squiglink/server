import * as getCurrentUserModule from "../services/get_current_user.js";
import { authenticationMiddleware } from "./authentication_middleware.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/get_current_user.js");

describe(".authenticationMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("responds with unauthorized if the authorization token is invalid", async () => {
    const body = vi.fn();
    const context: any = {
      body,
      req: { header: vi.fn().mockReturnValue("invalid") },
    };
    vi.mocked(getCurrentUserModule.getCurrentUser).mockResolvedValue(null);

    await authenticationMiddleware(context, async () => {
      throw new Error("Reached unreachable.");
    });

    expect(body).toHaveBeenCalledWith(null, 401);
  });

  it("responds with unauthorized if the authorization token is not present", async () => {
    const body = vi.fn();
    const context: any = {
      body,
      req: { header: vi.fn().mockReturnValue(undefined) },
    };

    await authenticationMiddleware(context, async () => {
      throw new Error("Reached unreachable.");
    });

    expect(body).toHaveBeenCalledWith(null, 401);
  });

  it("sets the current user context variable", async () => {
    const context: any = {
      req: { header: vi.fn().mockReturnValue("valid") },
      set: vi.fn(),
    };
    const currentUser = {
      created_at: new Date(),
      display_name: "placeholder",
      email: "placeholder",
      id: "placeholder",
      role: "creator" as const,
      scoring_system: "five_star" as const,
      updated_at: new Date(),
      username: "placeholder",
    };
    vi.mocked(getCurrentUserModule.getCurrentUser).mockResolvedValue(currentUser);

    await authenticationMiddleware(context, async () => {});

    expect(context.set).toHaveBeenCalledWith("currentUser", currentUser);
  });
});
