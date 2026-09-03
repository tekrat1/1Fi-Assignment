# Fairway — EMI Store (1Fi SDE1 Assignment)

A full-stack product page that shows smartphones with EMI plans backed by mutual funds.
Product, pricing, image galleries and EMI data live in MongoDB and are served through Next.js
API routes — the frontend does not contain product-specific image URLs or product records.

Live demo: https://fairway-orpin-delta.vercel.app
Demo video: https://youtu.be/-s3ldFy1IuI?si=zPMsFZLmB9zVqfLl

## Tech stack

- **Frontend:** React (via Next.js App Router), Tailwind CSS
- **Backend:** Next.js API routes (Node.js)
- **Database:** MongoDB (Mongoose ODM)

## Project structure

```
src/
  app/
    page.tsx                     -> home page, lists all products
    products/[slug]/page.tsx     -> dynamic product page (/products/iphone-17-pro)
    api/products/route.ts        -> GET /api/products
    api/products/[slug]/route.ts -> GET /api/products/:slug
  components/ProductView.tsx     -> client component: variant + EMI plan picker
  lib/db.ts                      -> MongoDB connection (cached for serverless)
  lib/emi.ts                     -> EMI math (monthly amount from price + template)
  models/Product.ts              -> Product + embedded variants schema
  models/EmiPlanTemplate.ts      -> EMI plan rules (tenure / interest / cashback)
scripts/seed.ts                  -> seeds 3 products (2-3 variants each) + EMI templates
```

## Setup and run instructions

### 1. Prerequisites
- Node.js 18+
- A MongoDB connection string (free tier on [MongoDB Atlas](https://www.mongodb.com/atlas) works fine)

### 2. Install
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# then edit .env and set MONGODB_URI to your connection string
```

### 4. Seed the database
```bash
npm run seed
```
This clears and repopulates the `products` and `emiplantemplates` collections with
3 products (each with 2–3 variants) and 7 EMI plan templates (0% for 3/6/12/24
months, 10.5% for 36/48/60 months, matching the reference design).

### 5. Run locally
```bash
npm run dev
```
Visit `http://localhost:3000`.

### 6. Build for production
```bash
npm run build
npm run start
```

## Deploying

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Add the `MONGODB_URI` environment variable in the Vercel project settings
   (same value as your local `.env`).
4. Deploy. Vercel builds `npm run build` and serves the app + API routes together
   (no separate backend deployment needed since API routes run as serverless functions).
5. Run `npm run seed` once from your local machine (pointed at the same
   `MONGODB_URI`) to populate the live database.

## Database schema

### `products` collection
| Field       | Type              | Notes                                  |
|-------------|-------------------|-----------------------------------------|
| name        | String            | e.g. "iPhone 17 Pro"                    |
| slug        | String, unique    | used for `/products/:slug` URL          |
| brand       | String            | e.g. "Apple"                            |
| category    | String            | e.g. "Smartphones"                      |
| description | String            |                                          |
| heroImage   | String (URL)      | fallback image shown on the list page   |
| finishes    | [String]          | color/finish names                      |
| variants    | [Variant]         | embedded sub-documents, see below       |

**Variant sub-document**
| Field        | Type   | Notes                          |
|--------------|--------|----------------------------------|
| variantLabel | String | e.g. "256GB Silver"              |
| storage      | String | optional                         |
| color        | String | optional                         |
| mrp          | Number | list price                       |
| price        | Number | selling price                    |
| image        | String | primary variant image             |
| images       | [String] | ordered gallery images for the variant |

### `emiplantemplates` collection
| Field         | Type   | Notes                                   |
|---------------|--------|-------------------------------------------|
| tenureMonths  | Number | e.g. 3, 6, 12, 24, 36, 48, 60              |
| interestRate  | Number | annual %, 0 for zero-cost EMI              |
| cashback      | Number | flat cashback in ₹, 0 if none              |
| order         | Number | display order                              |

EMI templates are shared across all products. The **monthly EMI amount is
calculated on the fly** per variant price using simple interest:

```
totalPayable  = price + price * (interestRate / 100) * (tenureMonths / 12)
monthlyAmount = round(totalPayable / tenureMonths)
```

This keeps EMI numbers accurate to whatever price is in the database, instead
of hardcoding monthly figures per product.

## API endpoints

### `GET /api/products`
Returns a summary of every product for the listing page.

**Example response**
```json
{
  "products": [
    {
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "category": "Smartphones",
      "heroImage": "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-silver-202509?wid=1200&hei=1200&fmt=png-alpha",
      "variantCount": 3,
      "startingPrice": 127400
    }
  ]
}
```

### `GET /api/products/:slug`
Returns full product details, all variants, and computed EMI plans per variant.

**Example: `GET /api/products/iphone-17-pro`**
```json
{
  "product": {
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "category": "Smartphones",
    "description": "Titanium design, A19 Pro chip, ...",
    "heroImage": "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-silver-202509?wid=1200&hei=1200&fmt=png-alpha",
    "finishes": ["Silver", "Orange", "Deep Blue"],
    "variants": [
      {
        "id": "665f1c...",
        "variantLabel": "256GB Silver",
        "storage": "256GB",
        "color": "Silver",
        "mrp": 134900,
        "price": 127400,
        "image": "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-silver-202509?wid=1200&hei=1200&fmt=png-alpha",
        "images": ["https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-silver-202509?wid=1200&hei=1200&fmt=png-alpha", "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-cosmicorange-202509?wid=1200&hei=1200&fmt=png-alpha", "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-deepblue-202509?wid=1200&hei=1200&fmt=png-alpha"],
        "emiPlans": [
          { "tenureMonths": 3, "interestRate": 0, "cashback": 3000, "monthlyAmount": 42467, "totalPayable": 127400 },
          { "tenureMonths": 36, "interestRate": 10.5, "cashback": 3000, "monthlyAmount": 4295, "totalPayable": 154607 }
        ]
      }
    ]
  }
}
```
`404` is returned with `{ "error": "Product not found" }` for an unknown slug.

## Image data

Each variant stores a primary `image` plus an ordered `images` gallery array in MongoDB.
The product detail API returns those URLs to the client, so product-specific gallery images
are not hardcoded in `ProductView.tsx`.

## Notes for the demo video

Good things to show in the 2–5 min walkthrough:
1. Home page loading products and images from `/api/products`.
2. A product page — switch variants, inspect multiple gallery images, switch EMI plans, click "Proceed".
3. `GET /api/products/:slug` hit directly in the browser or Postman; show the `images` array.
4. MongoDB Atlas collection view showing `products` and `emiplantemplates` documents.
5. Quick look at `scripts/seed.ts` and the schema files to show it's DB-driven, not hardcoded.
