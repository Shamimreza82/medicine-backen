-- CreateEnum
CREATE TYPE "TestCategory" AS ENUM ('BLOOD', 'URINE', 'STOOL', 'IMAGING', 'CARDIAC', 'HORMONE', 'BIOCHEMISTRY', 'MICROBIOLOGY', 'INFECTION', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "SeverityLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'SEVERE');

-- CreateEnum
CREATE TYPE "PregnancyRiskLevel" AS ENUM ('A', 'B', 'C', 'D', 'X', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "LactationRiskLevel" AS ENUM ('SAFE', 'CAUTION', 'UNSAFE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "lab_tests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_name" TEXT,
    "category" "TestCategory" NOT NULL,
    "description" TEXT,
    "specimen" TEXT,
    "preparation" TEXT,
    "normal_range" TEXT,
    "unit" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "scientific_name" TEXT,
    "drug_class" TEXT,
    "therapeutic_class" TEXT,
    "description" TEXT,
    "mechanism_of_action" TEXT,
    "pharmacokinetics" TEXT,
    "dosage_guideline" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generic_details" (
    "id" TEXT NOT NULL,
    "generic_id" TEXT NOT NULL,
    "overview" TEXT,
    "indication_summary" TEXT,
    "adult_dose" TEXT,
    "child_dose" TEXT,
    "renal_dose_adjustment" TEXT,
    "hepatic_dose_adjustment" TEXT,
    "administration" TEXT,
    "monitoring" TEXT,
    "precaution" TEXT,
    "storage_condition" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generic_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "manufacturer_id" TEXT NOT NULL,
    "generic_id" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "sku" TEXT,
    "strength" TEXT NOT NULL,
    "dosage_form" TEXT NOT NULL,
    "route" TEXT,
    "pack_size" TEXT,
    "unit_per_pack" INTEGER,
    "price" DECIMAL(10,2),
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "registration_number" TEXT,
    "barcode" TEXT,
    "is_prescription_required" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diseases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generic_indications" (
    "id" TEXT NOT NULL,
    "generic_id" TEXT NOT NULL,
    "disease_id" TEXT NOT NULL,
    "note" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generic_indications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "side_effects" (
    "id" TEXT NOT NULL,
    "generic_id" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "severity" "SeverityLevel" NOT NULL DEFAULT 'LOW',
    "frequency" TEXT,
    "note" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "side_effects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contraindications" (
    "id" TEXT NOT NULL,
    "generic_id" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "note" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contraindications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drug_interactions" (
    "id" TEXT NOT NULL,
    "source_generic_id" TEXT NOT NULL,
    "target_generic_id" TEXT NOT NULL,
    "severity" "SeverityLevel" NOT NULL DEFAULT 'MODERATE',
    "effect" TEXT,
    "management" TEXT,
    "note" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drug_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pregnancy_categories" (
    "id" TEXT NOT NULL,
    "generic_id" TEXT NOT NULL,
    "category" "PregnancyRiskLevel" NOT NULL DEFAULT 'UNKNOWN',
    "warning" TEXT,
    "recommendation" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pregnancy_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lactation_warnings" (
    "id" TEXT NOT NULL,
    "generic_id" TEXT NOT NULL,
    "risk_level" "LactationRiskLevel" NOT NULL DEFAULT 'UNKNOWN',
    "warning" TEXT,
    "recommendation" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lactation_warnings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lab_tests_name_key" ON "lab_tests"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lab_tests_slug_key" ON "lab_tests"("slug");

-- CreateIndex
CREATE INDEX "lab_tests_name_idx" ON "lab_tests"("name");

-- CreateIndex
CREATE INDEX "lab_tests_slug_idx" ON "lab_tests"("slug");

-- CreateIndex
CREATE INDEX "lab_tests_category_idx" ON "lab_tests"("category");

-- CreateIndex
CREATE INDEX "prescriptions_patient_id_idx" ON "prescriptions"("patient_id");

-- CreateIndex
CREATE INDEX "prescriptions_doctor_id_idx" ON "prescriptions"("doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_name_key" ON "manufacturers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_slug_key" ON "manufacturers"("slug");

-- CreateIndex
CREATE INDEX "manufacturers_name_idx" ON "manufacturers"("name");

-- CreateIndex
CREATE INDEX "manufacturers_slug_idx" ON "manufacturers"("slug");

-- CreateIndex
CREATE INDEX "manufacturers_is_active_idx" ON "manufacturers"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "generics_name_key" ON "generics"("name");

-- CreateIndex
CREATE UNIQUE INDEX "generics_slug_key" ON "generics"("slug");

-- CreateIndex
CREATE INDEX "generics_name_idx" ON "generics"("name");

-- CreateIndex
CREATE INDEX "generics_slug_idx" ON "generics"("slug");

-- CreateIndex
CREATE INDEX "generics_drug_class_idx" ON "generics"("drug_class");

-- CreateIndex
CREATE INDEX "generics_therapeutic_class_idx" ON "generics"("therapeutic_class");

-- CreateIndex
CREATE INDEX "generics_is_active_idx" ON "generics"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "generic_details_generic_id_key" ON "generic_details"("generic_id");

-- CreateIndex
CREATE INDEX "brands_name_idx" ON "brands"("name");

-- CreateIndex
CREATE INDEX "brands_slug_idx" ON "brands"("slug");

-- CreateIndex
CREATE INDEX "brands_manufacturer_id_idx" ON "brands"("manufacturer_id");

-- CreateIndex
CREATE INDEX "brands_generic_id_idx" ON "brands"("generic_id");

-- CreateIndex
CREATE INDEX "brands_is_active_idx" ON "brands"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "brands_manufacturer_id_name_key" ON "brands"("manufacturer_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_manufacturer_id_slug_key" ON "brands"("manufacturer_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");

-- CreateIndex
CREATE INDEX "products_brand_id_idx" ON "products"("brand_id");

-- CreateIndex
CREATE INDEX "products_strength_idx" ON "products"("strength");

-- CreateIndex
CREATE INDEX "products_dosage_form_idx" ON "products"("dosage_form");

-- CreateIndex
CREATE INDEX "products_route_idx" ON "products"("route");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "products_brand_id_strength_dosage_form_key" ON "products"("brand_id", "strength", "dosage_form");

-- CreateIndex
CREATE UNIQUE INDEX "diseases_name_key" ON "diseases"("name");

-- CreateIndex
CREATE UNIQUE INDEX "diseases_slug_key" ON "diseases"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "diseases_code_key" ON "diseases"("code");

-- CreateIndex
CREATE INDEX "diseases_name_idx" ON "diseases"("name");

-- CreateIndex
CREATE INDEX "diseases_slug_idx" ON "diseases"("slug");

-- CreateIndex
CREATE INDEX "diseases_code_idx" ON "diseases"("code");

-- CreateIndex
CREATE INDEX "diseases_category_idx" ON "diseases"("category");

-- CreateIndex
CREATE INDEX "diseases_is_active_idx" ON "diseases"("is_active");

-- CreateIndex
CREATE INDEX "generic_indications_generic_id_idx" ON "generic_indications"("generic_id");

-- CreateIndex
CREATE INDEX "generic_indications_disease_id_idx" ON "generic_indications"("disease_id");

-- CreateIndex
CREATE INDEX "generic_indications_is_primary_idx" ON "generic_indications"("is_primary");

-- CreateIndex
CREATE UNIQUE INDEX "generic_indications_generic_id_disease_id_key" ON "generic_indications"("generic_id", "disease_id");

-- CreateIndex
CREATE INDEX "side_effects_generic_id_idx" ON "side_effects"("generic_id");

-- CreateIndex
CREATE INDEX "side_effects_effect_idx" ON "side_effects"("effect");

-- CreateIndex
CREATE INDEX "side_effects_severity_idx" ON "side_effects"("severity");

-- CreateIndex
CREATE INDEX "contraindications_generic_id_idx" ON "contraindications"("generic_id");

-- CreateIndex
CREATE INDEX "contraindications_condition_idx" ON "contraindications"("condition");

-- CreateIndex
CREATE INDEX "drug_interactions_source_generic_id_idx" ON "drug_interactions"("source_generic_id");

-- CreateIndex
CREATE INDEX "drug_interactions_target_generic_id_idx" ON "drug_interactions"("target_generic_id");

-- CreateIndex
CREATE INDEX "drug_interactions_severity_idx" ON "drug_interactions"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "drug_interactions_source_generic_id_target_generic_id_key" ON "drug_interactions"("source_generic_id", "target_generic_id");

-- CreateIndex
CREATE UNIQUE INDEX "pregnancy_categories_generic_id_key" ON "pregnancy_categories"("generic_id");

-- CreateIndex
CREATE INDEX "pregnancy_categories_category_idx" ON "pregnancy_categories"("category");

-- CreateIndex
CREATE UNIQUE INDEX "lactation_warnings_generic_id_key" ON "lactation_warnings"("generic_id");

-- CreateIndex
CREATE INDEX "lactation_warnings_risk_level_idx" ON "lactation_warnings"("risk_level");

-- AddForeignKey
ALTER TABLE "generic_details" ADD CONSTRAINT "generic_details_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "generics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "generics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_indications" ADD CONSTRAINT "generic_indications_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "generics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_indications" ADD CONSTRAINT "generic_indications_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "diseases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "side_effects" ADD CONSTRAINT "side_effects_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "generics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contraindications" ADD CONSTRAINT "contraindications_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "generics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drug_interactions" ADD CONSTRAINT "drug_interactions_source_generic_id_fkey" FOREIGN KEY ("source_generic_id") REFERENCES "generics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drug_interactions" ADD CONSTRAINT "drug_interactions_target_generic_id_fkey" FOREIGN KEY ("target_generic_id") REFERENCES "generics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pregnancy_categories" ADD CONSTRAINT "pregnancy_categories_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "generics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lactation_warnings" ADD CONSTRAINT "lactation_warnings_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "generics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
