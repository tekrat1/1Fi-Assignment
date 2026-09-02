# Fairway — EMI Store

A small full-stack smartphone storefront built for the 1Fi SDE1 assignment. Product data, variant pricing, product images, and EMI rules are stored in MongoDB and exposed through Next.js API routes. The React UI consumes that API data rather than keeping product records in the frontend.

## Features

- Product listing with real product images
- Dynamic product pages using `/products/[slug]`
- Three smartphones with multiple storage/color variants
- Database-backed image galleries for every variant
- Seven EMI options per variant
- EMI amounts calculated from the selected variant price
- Interest rate and cashback displayed per plan
- Selectable EMI plan with a demo proceed action
- Responsive layout for desktop and mobile

## Tech stack

- **Frontend:** React 18, Next.js 14 App Router, Tailwind CSS
- **Backend:** Next.js Route Handlers / Node.js
- **Database:** MongoDB with Mongoose
- **Language:** TypeScript

## Project structure

```text
src/
  app/
    page.tsx                         Home/product listing
    products/[slug]/page.tsx         Dynamic product page
    api/products/route.ts            GET /api/products
    api/products/[slug]/route.ts     GET /api/products/:slug
  components/
    ProductGallery.tsx               Product image gallery
    ProductView.tsx                  Product page state and layout
    VariantSelectors.tsx             Color/variant selectors
    EmiPlanList.tsx                  EMI plan picker
  lib/
    baseUrl.ts                       Server-side API base URL
    db.ts                            Cached MongoDB connection
    emi.ts                           EMI calculation
    format.ts                        Currency formatting
  models/
    Product.ts                       Product and variant schema
    EmiPlanTemplate.ts               EMI rule schema
scripts/
  seed.ts                            Database seed data
```

## Local setup

### Requirements

- Node.js 18 or newer
- MongoDB Atlas or another MongoDB deployment

### Install dependencies

```bash
npm install
```

### Configure MongoDB

Copy the example environment file:

```bash
cp .env.example .env
```

Set the connection string in `.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/emi-store?retryWrites=true&w=majority
```

If using MongoDB Atlas, make sure your current IP address is allowed under **Network Access**.

### Seed the database

```bash
npm run seed
```

The seed command creates:

- 3 products
- 7 product variants in total
- 7 shared EMI templates

### Run the application

```bash
npm run dev
```

Open `http://localhost:3000`.

For a production build:

```bash
npm run build
npm run start
```

## API

### `GET /api/products`

Returns the product summaries used by the home page.

Example:

```json
{
  "products": [
    {
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "category": "Smartphones",
      "heroImage": "https://...",
      "variantCount": 3,
      "startingPrice": 127400
    }
  ]
}
```

### `GET /api/products/:slug`

Returns one product, its variants, database-backed image galleries, and EMI plans calculated for each variant.

Example shape:

```json
{
  "product": {
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "variants": [
      {
        "id": "...",
        "variantLabel": "256GB Silver",
        "storage": "256GB",
        "color": "Silver",
        "mrp": 134900,
        "price": 127400,
        "image": "https://...",
        "images": ["https://...", "https://..."],
        "emiPlans": [
          {
            "tenureMonths": 3,
            "interestRate": 0,
            "cashback": 3000,
            "monthlyAmount": 42467,
            "totalPayable": 127400
          }
        ]
      }
    ]
  }
}
```

An unknown slug returns HTTP `404` with:

```json
{ "error": "Product not found" }
```

## Database schema

### `products`

| Field | Type | Purpose |
|---|---|---|
| `name` | String | Product name |
| `slug` | String, unique | Product URL slug |
| `brand` | String | Manufacturer |
| `category` | String | Product category |
| `description` | String | Product description |
| `heroImage` | String | Image used on the listing page |
| `finishes` | String[] | Available color/finish names |
| `variants` | Variant[] | Storage/color/pricing/image data |

Each variant contains:

| Field | Type | Purpose |
|---|---|---|
| `variantLabel` | String | Human-readable variant name |
| `storage` | String | Storage option |
| `color` | String | Color/finish |
| `mrp` | Number | Listed price |
| `price` | Number | Selling price |
| `image` | String | Primary image |
| `images` | String[] | Ordered gallery images |

### `emiplantemplates`

| Field | Type | Purpose |
|---|---|---|
| `tenureMonths` | Number | EMI duration |
| `interestRate` | Number | Annual interest rate |
| `cashback` | Number | Cashback in INR |
| `order` | Number | Display order |

## EMI calculation

EMI rules are stored in MongoDB. The API calculates the amount for the selected variant price rather than storing a separate monthly payment for every product.

```text
interest = price * interestRate * tenureMonths / (100 * 12)
totalPayable = price + interest
monthlyAmount = round(totalPayable / tenureMonths)
```

## Image/data flow

The seed script stores each variant's primary image and complete gallery in MongoDB. The product API returns those values to the client. `ProductGallery` only renders the URLs it receives from the API; it does not contain product-specific image URLs.

## Deployment

The application can be deployed as one Next.js project on Vercel or another platform that supports Next.js.

1. Push the project to GitHub.
2. Import the repository into the deployment platform.
3. Add `MONGODB_URI` as a server environment variable.
4. Deploy the project.
5. Run `npm run seed` once against the production database.

Add the final deployment and demo-video links here before submitting the assignment.

## Demo checklist

For the required 2–5 minute walkthrough, show:

1. The product listing page.
2. A product page with variant and gallery changes.
3. EMI plan selection and the proceed action.
4. `/api/products` and `/api/products/:slug` responses.
5. MongoDB product and EMI collections.
6. The schema and seed files.
