/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import globalErrorHandler from '@/middlewares/globalErrorHandler';
import { AppError } from '@/shared/errors/AppError';

import createHospitalService from '../../application/service/createHospital.service';
import { hospitalRoutes } from '../../interfaces/hospital.routes';

import type { NextFunction, Request, Response } from 'express';



vi.mock('../../application/service/createHospital.service', () => ({
  default: vi.fn(),
}));




const getCreateHospitalHandlers = () => {
  const routeLayer = (hospitalRoutes as any).stack.find(
    (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post,
  );

  return routeLayer.route.stack.map((layer: any) => layer.handle);
};

const runCreateHospitalRoute = async (body: Record<string, unknown>) =>
  new Promise<{ status: number; body: unknown }>((resolve, reject) => {
    const req = {
      body,
      query: {},
      params: {},
      method: 'POST',
      originalUrl: '/api/v1/hospitals',
      headers: {},
      ip: '127.0.0.1',
    } as unknown as Request;

    let statusCode = 200;
    let headersSent = false;

    const res = {
      get headersSent() {
        return headersSent;
      },
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(payload: unknown) {
        headersSent = true;
        resolve({ status: statusCode, body: payload });
        return this;
      },
    } as unknown as Response;

    const handlers = getCreateHospitalHandlers();
    let index = 0;

    const next: NextFunction = (err?: unknown) => {
      if (err) {
        globalErrorHandler(err, req, res, () => undefined);
        return;
      }

      const handler = handlers[index++];
      if (!handler) {
        if (!res.headersSent) {
          resolve({ status: 200, body: undefined });
        }
        return;
      }

      try {
        handler(req, res, next);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };

    next();
  });

describe('Hospital API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a hospital successfully', async () => {
    const payload = {
      name: 'Apollo Hospital',
      email: 'apollo@example.com',
      phone: '+8801712345678',
      address: 'Dhaka',
      website: 'https://apollo.example.com',
    };

    const serviceResult = {
      hospital: { id: 'hospital-1', ...payload, slug: 'apollo-hospital' },
      adminUser: { id: 'user-1', email: payload.email },
    };

    vi.mocked(createHospitalService).mockResolvedValue(serviceResult as never);

    const res = await runCreateHospitalRoute(payload);

    expect(res.status).toBe(StatusCodes.CREATED);
    expect((res.body as any).success).toBe(true);
    expect((res.body as any).message).toBe('Hospital created successfully');
    expect((res.body as any).data).toEqual(serviceResult);
    expect(createHospitalService).toHaveBeenCalledWith(payload);
  });

  it('returns validation error for invalid payload', async () => {
    const payload = {
      name: 'A',
      phone: '12345',
    };

    const res = await runCreateHospitalRoute(payload);

    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect((res.body as any).success).toBe(false);
    expect((res.body as any).message).toBe('Invalid input data');
    expect(createHospitalService).not.toHaveBeenCalled();
  });

  it('maps service AppError to correct HTTP response', async () => {
    const payload = {
      name: 'Apollo Hospital',
      email: 'apollo@example.com',
    };

    vi.mocked(createHospitalService).mockRejectedValue(
      new AppError(StatusCodes.NOT_FOUND, 'Hospital Admin role not found'),
    );

    const res = await runCreateHospitalRoute(payload);

    expect(res.status).toBe(StatusCodes.NOT_FOUND);
    expect((res.body as any).success).toBe(false);
    expect((res.body as any).message).toBe('Hospital Admin role not found');
  });
});
