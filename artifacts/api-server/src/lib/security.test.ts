/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

// We test security.ts functions by importing them directly.
// Since security.ts uses logger which needs pino, we mock it.
vi.mock("../lib/logger", () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

import { attachRdmIdentity, requireRdmRole, rateLimitByRoute, type RdmRole } from "../lib/security";

function mockReq(ip = "127.0.0.1"): Request {
  return {
    headers: {},
    ip,
    socket: { remoteAddress: ip },
    path: "/test",
  } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    _status: undefined as number | undefined,
    _json: undefined as unknown,
    setHeader: vi.fn(),
    status(code: number) { res._status = code; return res; },
    json(data: unknown) { res._json = data; return res; },
  };
  return res as unknown as Response;
}

describe("attachRdmIdentity", () => {
  it("creates anonymous identity when no JWT identity exists", () => {
    const req = mockReq();
    const res = mockRes();
    let called = false;
    attachRdmIdentity(req, res, () => { called = true; });
    expect(called).toBe(true);
    expect((req as any).rdmIdentity.subject).toBe("anonymous");
    expect((req as any).rdmIdentity.role).toBe("public");
    expect((req as any).rdmIdentity.authMethod).toBe("anonymous");
  });

  it("preserves existing JWT identity and adds IP", () => {
    const req = mockReq();
    (req as any).rdmIdentity = {
      subject: "user-123",
      role: "user",
      authMethod: "jwt",
    };
    const res = mockRes();
    let called = false;
    attachRdmIdentity(req, res, () => { called = true; });
    expect(called).toBe(true);
    expect((req as any).rdmIdentity.subject).toBe("user-123");
    expect((req as any).rdmIdentity.role).toBe("user");
    expect((req as any).rdmIdentity.ip).toBeDefined();
  });
});

describe("requireRdmRole", () => {
  it("allows access when role is sufficient", () => {
    const req = mockReq();
    (req as any).rdmIdentity = { subject: "admin", role: "admin", ip: "127.0.0.1" };
    const res = mockRes();
    let called = false;
    requireRdmRole("operator")(req, res, () => { called = true; });
    expect(called).toBe(true);
  });

  it("denies access when role is insufficient", () => {
    const req = mockReq();
    (req as any).rdmIdentity = { subject: "user", role: "user", ip: "127.0.0.1" };
    const res = mockRes();
    let called = false;
    requireRdmRole("admin")(req, res, () => { called = true; });
    expect(called).toBe(false);
    expect((res as any)._status).toBe(403);
  });

  it("denies anonymous access to admin routes", () => {
    const req = mockReq();
    (req as any).rdmIdentity = { subject: "anonymous", role: "public", ip: "127.0.0.1" };
    const res = mockRes();
    let called = false;
    requireRdmRole("admin")(req, res, () => { called = true; });
    expect(called).toBe(false);
    expect((res as any)._status).toBe(403);
  });
});

describe("rateLimitByRoute", () => {
  it("allows requests within limit", () => {
    const req = mockReq();
    (req as any).rdmIdentity = { subject: "user-1", role: "user", ip: "127.0.0.1" };
    const res = mockRes();
    const middleware = rateLimitByRoute({ name: "test", limit: 3 });

    let called = 0;
    for (let i = 0; i < 3; i++) {
      middleware(req, res, () => { called++; });
    }
    expect(called).toBe(3);
  });

  it("blocks requests exceeding limit", () => {
    const req = mockReq();
    (req as any).rdmIdentity = { subject: "user-2", role: "user", ip: "127.0.0.1" };
    const res = mockRes();
    const middleware = rateLimitByRoute({ name: "test-limit", limit: 2 });

    let called = 0;
    for (let i = 0; i < 5; i++) {
      middleware(req, res, () => { called++; });
    }
    expect(called).toBe(2);
    expect((res as any)._status).toBe(429);
  });
});
