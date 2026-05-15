import { AppError } from '@/shared/errors/AppError';
import { paginateResponse } from '@/shared/utils/paginateResponse';

import { LabTestRepository } from '../lab-test/labTest.repository';
import { adminRepository } from '../admin/admin.repository';
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
    const result = await medicineRepository.createBrand(data);
    await adminRepository.createAuditLog({
      action: 'Added New Brand',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  }

  async updateBrand(id: number, data: any) {
    await this.getBrandById(id);
    const result = await medicineRepository.updateBrand(id, data);
    await adminRepository.createAuditLog({
      action: 'Updated Brand',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  }

  async searchGenerics(query: MedicineSearchQuery) {
    const { data, total } = await medicineRepository.searchGenerics(query);
    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  }

  async createGeneric(data: any) {
    const result = await medicineRepository.createGeneric(data);
    await adminRepository.createAuditLog({
      action: 'Added New Generic',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  }

  async updateGeneric(id: number, data: any) {
    const existing = await this.getGenericById(id);
    const result = await medicineRepository.updateGeneric(id, data);
    await adminRepository.createAuditLog({
      action: 'Updated Generic',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  }

  async searchIndications(query: MedicineSearchQuery) {
    const { data, total } = await medicineRepository.searchIndications(query);
    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  }

  async createIndication(data: any) {
    const result = await medicineRepository.createIndication(data);
    await adminRepository.createAuditLog({
      action: 'Added New Indication',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  }

  async updateIndication(id: number, data: any) {
    await this.getIndicationById(id);
    const result = await medicineRepository.updateIndication(id, data);
    await adminRepository.createAuditLog({
      action: 'Updated Indication',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  }

  async searchCompanies(query: MedicineSearchQuery) {
    const { data, total } = await medicineRepository.searchCompanies(query);
    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  }

  async createCompany(data: any) {
    const result = await medicineRepository.createCompany(data);
    await adminRepository.createAuditLog({
      action: 'Added New Company',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  }

  async updateCompany(id: number, data: any) {
    await this.getCompanyById(id);
    const result = await medicineRepository.updateCompany(id, data);
    await adminRepository.createAuditLog({
      action: 'Updated Company',
      target: result.name,
      userName: 'Admin',
    });
    return result;
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
