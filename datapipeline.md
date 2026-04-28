# Data Pipeline

This project loads medicine master data from CSV files in `prisma/seed/data` into PostgreSQL through Prisma seed importers.

## Source of truth

- All CSV source files live in `prisma/seed/data`.
- Each file header must match the interface defined in `prisma/seed/helpers/parsers.ts`.
- CSV files are read by `prisma/seed/helpers/csv.ts` using:
  - `columns: true`
  - `skip_empty_lines: true`
  - `trim: true`

That means:

- The first row is treated as the header row.
- Empty lines are ignored.
- Leading and trailing spaces are trimmed during parsing.

## Normalization rules

These rules are applied before data is written:

- Empty strings become `null` for optional text fields.
- Slugs are normalized to lowercase with `toSlug()`.
- Boolean values accept `true`, `1`, `yes`, `y`; anything else becomes `false`.
- Integer fields use `parseInt`; invalid values become `null`.
- Decimal fields use `parseFloat`; invalid values become `null`.
- Enum values are uppercased before validation.

## Data load order

The seed runner is `prisma/seed.ts`. It imports files in this order:

1. `manufacturers.csv`
2. `generics.csv`
3. `diseases.csv`
4. `generic_details.csv`
5. `pregnancy_categories.csv`
6. `lactation_warnings.csv`
7. `generic_indications.csv`
8. `side_effects.csv`
9. `contraindications.csv`
10. `drug_interactions.csv`
11. `brands.csv`
12. `products.csv`

This order matters because later files depend on records created by earlier files.

## File to table mapping

| CSV file | Prisma model | Dependency |
| --- | --- | --- |
| `manufacturers.csv` | `Manufacturer` | none |
| `generics.csv` | `Generic` | none |
| `diseases.csv` | `Disease` | none |
| `generic_details.csv` | `GenericDetail` | `generic_slug` must exist in `generics.csv` |
| `pregnancy_categories.csv` | `PregnancyCategory` | `generic_slug` must exist in `generics.csv` |
| `lactation_warnings.csv` | `LactationWarning` | `generic_slug` must exist in `generics.csv` |
| `generic_indications.csv` | `GenericIndication` | `generic_slug` and `disease_slug` must already exist |
| `side_effects.csv` | `SideEffect` | `generic_slug` must exist |
| `contraindications.csv` | `Contraindication` | `generic_slug` must exist |
| `drug_interactions.csv` | `DrugInteraction` | both generic slugs must exist |
| `brands.csv` | `Brand` | `manufacturer_slug` and `generic_slug` must exist |
| `products.csv` | `Product` | `brand_slug` must exist |

## Upsert vs create behavior

- `Manufacturer`, `Generic`, `Disease`, `GenericDetail`, `PregnancyCategory`, `LactationWarning`, `GenericIndication`, `DrugInteraction`, `Brand`, and `Product` use `upsert`.
- `SideEffect` and `Contraindication` use `create`, so repeated seed runs can create duplicates for those rows.

## Skip behavior

Some importers skip rows if referenced parent records are missing:

- `generic_details.csv`
- `pregnancy_categories.csv`
- `lactation_warnings.csv`
- `generic_indications.csv`
- `side_effects.csv`
- `contraindications.csv`
- `drug_interactions.csv`
- `brands.csv`
- `products.csv`

Skipped rows are logged with `console.warn(...)`.

## CSV feeding workflow

To add or update medicine data:

1. Edit the CSV files in `prisma/seed/data`.
2. Keep headers exactly aligned with the parser interfaces.
3. Make sure parent files are updated before child files.
4. Run database migrations if the schema changed.
5. Run the seed pipeline.

Example seed command:

```bash
npx tsx prisma/seed.ts
```

## Practical dependency rules

- Create manufacturers before brands.
- Create generics before generic details, pregnancy data, lactation data, indications, side effects, contraindications, interactions, and brands.
- Create diseases before generic indications.
- Create brands before products.

## Required fields by file

Minimum fields that must be valid for reliable import:

- `manufacturers.csv`: `name`, `slug`
- `generics.csv`: `name`, `slug`
- `diseases.csv`: `name`, `slug`
- `generic_details.csv`: `generic_slug`
- `pregnancy_categories.csv`: `generic_slug`
- `lactation_warnings.csv`: `generic_slug`
- `generic_indications.csv`: `generic_slug`, `disease_slug`
- `side_effects.csv`: `generic_slug`, `effect`
- `contraindications.csv`: `generic_slug`, `condition`
- `drug_interactions.csv`: `source_generic_slug`, `target_generic_slug`
- `brands.csv`: `name`, `slug`, `manufacturer_slug`, `generic_slug`
- `products.csv`: `brand_slug`, `strength`, `dosage_form`

## Enum values

Allowed enum values in CSVs:

- Product status: `ACTIVE`, `INACTIVE`, `DISCONTINUED`
- Severity: `LOW`, `MODERATE`, `HIGH`, `SEVERE`
- Pregnancy category: `A`, `B`, `C`, `D`, `X`, `UNKNOWN`
- Lactation risk: `SAFE`, `CAUTION`, `UNSAFE`, `UNKNOWN`

If enum values are invalid and no fallback exists, the import will fail. In this codebase, all enum-based importers use a fallback default.

## Notes

- Brand lookup in `products.importer.ts` uses `findFirst({ where: { slug } })`, so brand slugs should stay globally unique even though the database uniqueness is scoped by manufacturer.
- `price` is stored as a Prisma decimal column but parsed from CSV using `parseFloat`.
- `sku`, `barcode`, and some code fields are unique in the database where defined by the schema.
