import { paginateResponse } from '@/shared/utils/paginateResponse';

import { medicineRepository } from './medicine.repository';
import { MedicineSearchQuery } from './medicine.types';

export class MedicineService {
  async searchBrands(query: MedicineSearchQuery) {
    const brands = await medicineRepository.searchBrands(query);
    const total = await medicineRepository.countBrands(query.q || '');

    return paginateResponse(brands, total, query.page, query.limit);
  }

  async searchGenerics(query: MedicineSearchQuery) {
    const generics = await medicineRepository.searchGenerics(query);
    const total = await medicineRepository.countGenerics(query.q || '');

    return paginateResponse(generics, total, query.page, query.limit);
  }

  async searchIndications(query: MedicineSearchQuery) {
    const indications = await medicineRepository.searchIndications(query);
    const total = await medicineRepository.countIndications(query.q || '');

    return paginateResponse(indications, total, query.page, query.limit);
  }

  async combinedSearch(query: MedicineSearchQuery) {
    const [brands, generics, indications] = await Promise.all([
      medicineRepository.searchBrands({ ...query, limit: 5 }),
      medicineRepository.searchGenerics({ ...query, limit: 5 }),
      medicineRepository.searchIndications({ ...query, limit: 5 }),
    ]);

    return {
      brands,
      generics,
      indications,
    };
  }
}

export const medicineService = new MedicineService();
