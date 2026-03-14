import { describe, expect, it, beforeEach, vi } from 'vitest';

import { generateSlug } from '@/shared/utils/generateSlug';

import createHospitalService from '../../application/service/createTenant.service';
import { createHospitalRepository } from '../../infrastructure/hospital.repository';

vi.mock('../../infrastructure/hospital.repository', () => ({
  createHospitalRepository: vi.fn(),
}));

vi.mock('@/shared/utils/generateSlug', () => ({
  generateSlug: vi.fn(),
}));

describe('createHospitalService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses provided slug and forwards payload to repository', async () => {
    const payload = {
      name: 'Square Hospital',
      slug: 'square-hospital',
      email: 'admin@square.com',
    };

    const repositoryResult = {
      hospital: { id: 'hospital-1', ...payload },
      adminUser: { id: 'user-1', email: payload.email },
    };

    vi.mocked(createHospitalRepository).mockResolvedValue(repositoryResult as never);

    const result = await createHospitalService(payload);

    expect(generateSlug).not.toHaveBeenCalled();
    expect(createHospitalRepository).toHaveBeenCalledWith(payload, payload.slug);
    expect(result).toEqual(repositoryResult);
  });

  it('generates slug when payload has no slug', async () => {
    const payload = {
      name: 'United Hospital',
      email: 'admin@united.com',
    };

    const generatedSlug = 'united-hospital';
    const repositoryResult = {
      hospital: { id: 'hospital-2', ...payload, slug: generatedSlug },
      adminUser: { id: 'user-2', email: payload.email },
    };

    vi.mocked(generateSlug).mockReturnValue(generatedSlug);
    vi.mocked(createHospitalRepository).mockResolvedValue(repositoryResult as never);

    const result = await createHospitalService(payload);

    expect(generateSlug).toHaveBeenCalledWith(payload.name);
    expect(createHospitalRepository).toHaveBeenCalledWith(payload, generatedSlug);
    expect(result).toEqual(repositoryResult);
  });
});
