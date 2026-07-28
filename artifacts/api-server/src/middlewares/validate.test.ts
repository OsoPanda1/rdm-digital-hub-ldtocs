/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { describe, it, expect } from "vitest";
import { validate, schemas } from "./validate";
import type { Request, Response, NextFunction } from "express";

function mockReq(body: unknown): Request {
  return { body } as Request;
}

function mockRes(): Response & { _status?: number; _json?: unknown } {
  const res = {
    _status: undefined as number | undefined,
    _json: undefined as unknown,
    status(code: number) {
      res._status = code;
      return res;
    },
    json(data: unknown) {
      res._json = data;
      return res;
    },
  };
  return res as Response;
}

describe("validate middleware", () => {
  it("calls next() when body is valid", () => {
    const middleware = validate(schemas.isabellaChat);
    const req = mockReq({ message: "Hello, Isabella" });
    const res = mockRes();
    let called = false;
    middleware(req, res, () => { called = true; });
    expect(called).toBe(true);
    expect(res._status).toBeUndefined();
  });

  it("returns 400 when required field is missing", () => {
    const middleware = validate(schemas.isabellaChat);
    const req = mockReq({});
    const res = mockRes();
    let called = false;
    middleware(req, res, () => { called = true; });
    expect(called).toBe(false);
    expect(res._status).toBe(400);
    const body = res._json as { details: Array<{ field: string }> };
    expect(body.details.some((d) => d.field === "message")).toBe(true);
  });

  it("returns 400 when string field exceeds max length", () => {
    const middleware = validate(schemas.isabellaChat);
    const req = mockReq({ message: "x".repeat(5000) });
    const res = mockRes();
    let called = false;
    middleware(req, res, () => { called = true; });
    expect(called).toBe(false);
    expect(res._status).toBe(400);
  });

  it("returns 400 when number field is out of range", () => {
    const middleware = validate(schemas.awardXp);
    const req = mockReq({ playerId: "p1", amount: 999, reason: "test" });
    const res = mockRes();
    let called = false;
    middleware(req, res, () => { called = true; });
    expect(called).toBe(false);
    expect(res._status).toBe(400);
  });

  it("passes when optional fields are omitted", () => {
    const middleware = validate(schemas.isabellaChat);
    const req = mockReq({ message: "Hello" });
    const res = mockRes();
    let called = false;
    middleware(req, res, () => { called = true; });
    expect(called).toBe(true);
  });

  it("validates enum fields correctly", () => {
    const middleware = validate(schemas.awardXp);
    const req = mockReq({ playerId: "p1", amount: 10, reason: "test" });
    const res = mockRes();
    let called = false;
    middleware(req, res, () => { called = true; });
    expect(called).toBe(true);
  });

  it("returns 400 when body is not an object", () => {
    const middleware = validate(schemas.isabellaChat);
    const req = mockReq("not an object");
    const res = mockRes();
    let called = false;
    middleware(req, res, () => { called = true; });
    expect(called).toBe(false);
    expect(res._status).toBe(400);
  });

  it("validates territoryAsk schema", () => {
    const middleware = validate(schemas.territoryAsk);
    const res = mockRes();

    // Valid
    let called = false;
    middleware(mockReq({ question: "Tell me about RDM" }), res, () => { called = true; });
    expect(called).toBe(true);

    // Invalid (empty)
    called = false;
    middleware(mockReq({ question: "" }), res, () => { called = true; });
    expect(called).toBe(false);
    expect(res._status).toBe(400);
  });

  it("validates identityCitizen schema", () => {
    const middleware = validate(schemas.identityCitizen);
    const res = mockRes();

    // Valid
    let called = false;
    middleware(mockReq({ name: "Edwin", email: "edwin@test.com" }), res, () => { called = true; });
    expect(called).toBe(true);

    // Invalid (missing email)
    called = false;
    middleware(mockReq({ name: "Edwin" }), res, () => { called = true; });
    expect(called).toBe(false);
  });
});
