-- CreateTable
CREATE TABLE "lab_tests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_name" TEXT,
    "category" TEXT,
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
CREATE TABLE "t_company_name" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "t_company_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_drug_generic" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "indication" TEXT,
    "administration" TEXT,
    "adult_dose" TEXT,
    "child_dose" TEXT,
    "contra_indication" TEXT,
    "interaction" TEXT,
    "mode_of_action" TEXT,
    "precaution" TEXT,
    "pregnancy_category_id" INTEGER,
    "pregnancy_category_note" TEXT,
    "renal_dose" TEXT,
    "side_effect" TEXT,

    CONSTRAINT "t_drug_generic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_drug_brand" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "generic_id" INTEGER NOT NULL,
    "form" TEXT,
    "packsize" TEXT,
    "price" TEXT,
    "strength" TEXT,
    "is_sponsored" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "t_drug_brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_herbal_generic" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "composition" TEXT,
    "contraindication" TEXT,
    "description" TEXT,
    "dosage" TEXT,
    "drug_interaction" TEXT,
    "indication" TEXT,
    "mode_of_actions" TEXT,
    "precaution" TEXT,
    "pregnancy_lactation" TEXT,
    "side_effects" TEXT,
    "therapeutic_class" TEXT,

    CONSTRAINT "t_herbal_generic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_herbal_brand" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "generic_id" INTEGER NOT NULL,
    "form" TEXT,
    "packsize" TEXT,
    "price" TEXT,
    "strength" TEXT,

    CONSTRAINT "t_herbal_brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_indication" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "t_indication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_pregnancy_category" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "t_pregnancy_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_systemic" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "systemic_parent_id" INTEGER,

    CONSTRAINT "t_systemic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_therapitic" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "systemic_category_id" INTEGER NOT NULL,

    CONSTRAINT "t_therapitic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_indication_generic_index" (
    "id" INTEGER NOT NULL,
    "generic_id" INTEGER NOT NULL,
    "indication_id" INTEGER NOT NULL,

    CONSTRAINT "t_indication_generic_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_therapitic_generic" (
    "id" INTEGER NOT NULL,
    "generic_id" INTEGER NOT NULL,
    "therapitic_id" INTEGER NOT NULL,

    CONSTRAINT "t_therapitic_generic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_sponsored_brand" (
    "brand_id" INTEGER NOT NULL,
    "generic_id" INTEGER NOT NULL,

    CONSTRAINT "t_sponsored_brand_pkey" PRIMARY KEY ("brand_id","generic_id")
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
CREATE UNIQUE INDEX "t_indication_name_key" ON "t_indication"("name");

-- AddForeignKey
ALTER TABLE "t_drug_generic" ADD CONSTRAINT "t_drug_generic_pregnancy_category_id_fkey" FOREIGN KEY ("pregnancy_category_id") REFERENCES "t_pregnancy_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_drug_brand" ADD CONSTRAINT "t_drug_brand_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "t_company_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_drug_brand" ADD CONSTRAINT "t_drug_brand_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "t_drug_generic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_herbal_brand" ADD CONSTRAINT "t_herbal_brand_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "t_company_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_herbal_brand" ADD CONSTRAINT "t_herbal_brand_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "t_herbal_generic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_systemic" ADD CONSTRAINT "t_systemic_systemic_parent_id_fkey" FOREIGN KEY ("systemic_parent_id") REFERENCES "t_systemic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_therapitic" ADD CONSTRAINT "t_therapitic_systemic_category_id_fkey" FOREIGN KEY ("systemic_category_id") REFERENCES "t_systemic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_indication_generic_index" ADD CONSTRAINT "t_indication_generic_index_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "t_drug_generic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_indication_generic_index" ADD CONSTRAINT "t_indication_generic_index_indication_id_fkey" FOREIGN KEY ("indication_id") REFERENCES "t_indication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_therapitic_generic" ADD CONSTRAINT "t_therapitic_generic_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "t_drug_generic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_therapitic_generic" ADD CONSTRAINT "t_therapitic_generic_therapitic_id_fkey" FOREIGN KEY ("therapitic_id") REFERENCES "t_therapitic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_sponsored_brand" ADD CONSTRAINT "t_sponsored_brand_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "t_drug_brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_sponsored_brand" ADD CONSTRAINT "t_sponsored_brand_generic_id_fkey" FOREIGN KEY ("generic_id") REFERENCES "t_drug_generic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
