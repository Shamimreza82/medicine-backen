import { AppError } from '@/shared/errors/AppError';
import { paginateResponse } from '@/shared/utils/paginateResponse';

import { LabTestRepository } from '../lab-test/labTest.repository';
import { medicineRepository } from './medicine.repository';
import { MedicineSearchQuery } from './medicine.types';

export class MedicineService {
  async getStats() {
    const medicineStats = await medicineRepository.getStats();
    const { total: labTests } = await LabTestRepository.search({ limit: 1, page: 1 });

    return {
      ...medicineStats,
      labTests,
    };
  }

  async searchBrands(query: MedicineSearchQuery) {
    const { data, total } = await medicineRepository.searchBrands(query);
    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  }

  async createBrand(data: any) {
    return medicineRepository.createBrand(data);
  }

  async updateBrand(id: number, data: any) {
    await this.getBrandById(id);
    return medicineRepository.updateBrand(id, data);
  }

  async searchGenerics(query: MedicineSearchQuery) {
    const { data, total } = await medicineRepository.searchGenerics(query);
    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  }

  async createGeneric(data: any) {
    return medicineRepository.createGeneric(data);
  }

  async updateGeneric(id: number, data: any) {
    // Check if generic exists
    await this.getGenericById(id);
    return medicineRepository.updateGeneric(id, data);
  }

  async searchIndications(query: MedicineSearchQuery) {
    const { data, total } = await medicineRepository.searchIndications(query);
    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  }

  async createIndication(data: any) {
    return medicineRepository.createIndication(data);
  }

  async updateIndication(id: number, data: any) {
    await this.getIndicationById(id);
    return medicineRepository.updateIndication(id, data);
  }

  async searchCompanies(query: MedicineSearchQuery) {
    const { data, total } = await medicineRepository.searchCompanies(query);
    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  }

  async createCompany(data: any) {
    return medicineRepository.createCompany(data);
  }

  async updateCompany(id: number, data: any) {
    await this.getCompanyById(id);
    return medicineRepository.updateCompany(id, data);
  }

  async getPregnancyCategories() {
    return medicineRepository.getPregnancyCategories();
  }

  async getClassificationTree() {
    return medicineRepository.getClassificationTree();
  }

  async combinedSearch(query: MedicineSearchQuery) {
    const [brands, generics, indications, companies] = await Promise.all([
      medicineRepository.searchBrands({ ...query, limit: 5 }),
      medicineRepository.searchGenerics({ ...query, limit: 5 }),
      medicineRepository.searchIndications({ ...query, limit: 5 }),
      medicineRepository.searchCompanies({ ...query, limit: 5 }),
    ]);

    return {
      brands: brands.data,
      generics: generics.data,
      indications: indications.data,
      companies: companies.data,
    };
  }

  async getBrandById(id: number) {
    const brand = await medicineRepository.getBrandById(id);
    if (!brand) {
      throw new AppError(404, 'Brand not found');
    }
    return brand;
  }

  async getGenericById(id: number) {
    const generic = await medicineRepository.getGenericById(id);
    if (!generic) {
      throw new AppError(404, 'Generic not found');
    }
    return generic;
  }

  async getCompanyById(id: number) {
    const company = await medicineRepository.getCompanyById(id);
    if (!company) {
      throw new AppError(404, 'Company not found');
    }
    return company;
  }

  async getIndicationById(id: number) {
    const indication = await medicineRepository.getIndicationById(id);
    if (!indication) {
      throw new AppError(404, 'Indication not found');
    }
    return indication;
  }

  async getDistinctForms(query: MedicineSearchQuery) {
    const { data, total } = await medicineRepository.getDistinctForms(query);
    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  }
}

export const medicineService = new MedicineService();
