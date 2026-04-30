# Frontend API Guide

This file documents the API surface that is currently exposed by this backend for frontend work.

## Base URLs

- API base: `/api/v1`
- Swagger docs: `/docs`
- Root health check: `/`

Example local base URL:

```text
http://localhost:4000/api/v1
```

## Response Format

Successful responses use this shape:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Notes:

- `meta` is only included for paginated/list responses.
- Some success responses may not include `data`.

Error responses use this shape:

```json
{
  "success": false,
  "message": "Error message",
  "error": {}
}
```

Notes:

- In development, a `stack` field may also be returned.
- Validation errors come from Zod, so invalid query/body input will return a structured error payload.

## Current Public Endpoints

### 1. Root Health

- Method: `GET`
- URL: `/`
- Purpose: Basic server check

Example response:

```json
{
  "success": true,
  "message": "api work file"
}
```

### 2. Lab Tests

#### `GET /api/v1/lab-tests/search`

Search lab tests from PostgreSQL.

Query params:

- `q`: `string`, optional, default `""`
- `category`: `string`, optional
- `specimen`: `string`, optional
- `limit`: `number`, optional, default `10`, min `1`, max `50`
- `page`: `number`, optional, default `1`, min `1`

Search behavior:

- Only active lab tests are returned.
- `q` matches `name`, `slug`, `shortName`, and `description`.
- `category` and `specimen` are exact filters, case-insensitive.
- Results are ordered by `name ASC`.

Example request:

```http
GET /api/v1/lab-tests/search?q=cbc&limit=10&page=1
```

Example response:

```json
{
  "success": true,
  "message": "Lab tests retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "data": [
    {
      "id": "uuid",
      "name": "Complete Blood Count",
      "slug": "complete-blood-count",
      "shortName": "CBC",
      "category": "Hematology",
      "description": "Basic blood panel",
      "specimen": "Blood",
      "preparation": null,
      "normalRange": null,
      "unit": null,
      "isActive": true,
      "metadata": null,
      "createdAt": "2026-04-28T00:00:00.000Z",
      "updatedAt": "2026-04-28T00:00:00.000Z"
    }
  ]
}
```

### 3. Medicines

#### `GET /api/v1/medicines/search`

Combined medicine search. Returns both brands and generics in one response.

Query params:

- `q`: `string`, required
- `limit`: `number`, optional, default `10`, min `1`, max `20`

Example request:

```http
GET /api/v1/medicines/search?q=paracetamol&limit=10
```

Example response shape:

```json
{
  "success": true,
  "message": "Medicine suggestions retrieved successfully",
  "data": {
    "brands": [],
    "generics": []
  }
}
```

#### `GET /api/v1/medicines/brands/search`

Brand-only search.

Query params:

- `q`: `string`, required
- `limit`: `number`, optional, default `10`, min `1`, max `20`

Brand item shape:

```json
{
  "id": "uuid",
  "name": "Napa",
  "slug": "napa",
  "manufacturer": {
    "id": "uuid",
    "name": "Beximco"
  },
  "generic": {
    "id": "uuid",
    "name": "Paracetamol",
    "slug": "paracetamol"
  },
  "products": [
    {
      "id": "uuid",
      "strength": "500 mg",
      "dosageForm": "Tablet",
      "route": "Oral",
      "packSize": "10 tablets",
      "unitPerPack": 10,
      "price": "12.50",
      "isPrescriptionRequired": false
    }
  ]
}
```

#### `GET /api/v1/medicines/generics/search`

Generic-only search.

Query params:

- `q`: `string`, required
- `limit`: `number`, optional, default `10`, min `1`, max `20`

Generic item shape:

```json
{
  "id": "uuid",
  "name": "Paracetamol",
  "slug": "paracetamol",
  "scientificName": null,
  "drugClass": null,
  "therapeuticClass": null,
  "commonDoseTemplate": {
    "adultDose": null,
    "childDose": null,
    "dosageGuideline": null,
    "administration": null
  },
  "availableBrands": [
    {
      "id": "uuid",
      "name": "Napa"
    }
  ]
}
```

#### `GET /api/v1/medicines/brands/:brandId/products`

Get products and common dose details for a specific brand.

Path params:

- `brandId`: `string`, required

Example response shape:

```json
{
  "success": true,
  "message": "Brand product suggestions retrieved successfully",
  "data": {
    "brand": {
      "id": "uuid",
      "name": "Napa",
      "slug": "napa"
    },
    "manufacturer": {
      "id": "uuid",
      "name": "Beximco"
    },
    "generic": {
      "id": "uuid",
      "name": "Paracetamol",
      "slug": "paracetamol"
    },
    "commonDoseTemplate": {
      "adultDose": null,
      "childDose": null,
      "dosageGuideline": null,
      "administration": null
    },
    "products": [],
    "strengths": [],
    "dosageForms": []
  }
}
```

#### `GET /api/v1/medicines/generics/:genericId/dose-templates`

Get a generic medicine dose template.

Path params:

- `genericId`: `string`, required

Example response shape:

```json
{
  "success": true,
  "message": "Dose template retrieved successfully",
  "data": {
    "genericId": "uuid",
    "genericName": "Paracetamol",
    "adultDose": null,
    "childDose": null,
    "dosageGuideline": null,
    "administration": null,
    "monitoring": null,
    "precaution": null
  }
}
```

#### `GET /api/v1/medicines/diseases/:diseaseId/suggestions`

Get disease-wise medicine suggestions.

Path params:

- `diseaseId`: `string`, required

Query params:

- `limit`: `number`, optional, default `10`, min `1`, max `20`

Example response shape:

```json
{
  "success": true,
  "message": "Disease-wise medicine suggestions retrieved successfully",
  "data": {
    "disease": {
      "id": "uuid",
      "name": "Fever",
      "slug": "fever"
    },
    "medicines": [
      {
        "genericId": "uuid",
        "genericName": "Paracetamol",
        "genericSlug": "paracetamol",
        "isPrimary": true,
        "note": null,
        "commonDoseTemplate": {
          "adultDose": null,
          "childDose": null,
          "dosageGuideline": null,
          "administration": null
        },
        "brands": []
      }
    ]
  }
}
```

#### `POST /api/v1/medicines/check-warnings`

Check warnings before prescribing a candidate generic medicine.

Request body:

```json
{
  "candidateGenericId": "uuid",
  "currentGenericIds": ["uuid-1", "uuid-2"],
  "pregnancy": false,
  "lactation": false,
  "allergyNotes": ["Penicillin allergy"]
}
```

Body rules:

- `candidateGenericId`: required
- `currentGenericIds`: optional, defaults to `[]`
- `pregnancy`: optional, defaults to `false`
- `lactation`: optional, defaults to `false`
- `allergyNotes`: optional, defaults to `[]`

Example response shape:

```json
{
  "success": true,
  "message": "Medicine warnings checked successfully",
  "data": {
    "pregnancy": null,
    "lactation": null,
    "contraindications": [
      {
        "condition": "Liver disease",
        "note": null
      }
    ],
    "interactions": [
      {
        "withGenericId": "uuid",
        "withGenericName": "Warfarin",
        "severity": "HIGH",
        "effect": null,
        "management": null,
        "note": null
      }
    ],
    "allergyAdvisory": "Patient allergy notes: Penicillin allergy. This app does not yet have structured allergy-to-medicine matching, so confirm manually against the contraindications and ingredient list. Relevant contraindications: Liver disease."
  }
}
```

## Important Frontend Notes

- Current mounted API prefix is `/api/v1`.
- Swagger UI is available at `/docs`.
- There is no auth middleware on the currently mounted `lab-tests` and `medicines` routes.
- The lab test module is database-backed and does not require Meilisearch.
- Medicine search endpoints return only active records.
- Medicine brand product lists are limited in some search endpoints. If the UI needs full product detail for a brand, call `GET /medicines/brands/:brandId/products`.
- `price` is returned as a string, not a number.
- Many optional fields can be `null`. Frontend rendering should not assume presence.
- `GET /medicines/search` is useful for a global autosuggest input because it returns both `brands` and `generics`.
- `GET /lab-tests/search` supports empty `q`, so it can also be used for initial listing with only filters or pagination.

## Suggested Frontend Types

Useful shared TypeScript shape:

```ts
type ApiSuccess<T> = {
  success: true;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

type ApiError = {
  success: false;
  message: string;
  error?: unknown;
  stack?: string;
};
```

## Suggested Pages

- Dashboard or search home
- Lab test search/list page
- Medicine search/autocomplete page
- Brand details page
- Generic dose template modal or page
- Disease suggestion page
- Prescription warning checker form
