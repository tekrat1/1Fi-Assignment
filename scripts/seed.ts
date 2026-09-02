import "dotenv/config";
import mongoose from "mongoose";
import Product from "../src/models/Product";
import EmiPlanTemplate from "../src/models/EmiPlanTemplate";


const imageUrls = {
  samsungBlack:
    "https://cdn.salla.sa/Yzven/f3f252aa-eb19-4432-b7df-42d30e7fa2d0-1000x1000-SC9gwoVI07fdyewKu5m4Ef9vDe1NWbqX43wJnlMw.jpg",
  samsungGray:
    "https://cdn.idealo.com/folder/Product/203713/8/203713853/s1_produktbild_max/samsung-galaxy-s24-ultra-512gb-titanium-gray.jpg",
  oneplusOcean:
    "https://mobileplanet.ua/uploads/product/2025-12-2/oneplus-13-24-1tb-midnight-ocean-europe-365714.webp",
  oneplusDawn:
    "https://www.proshop.fi/Images/915x900/3319812_3f370bc9e9d4.png",
};

const appleIphone17Image = (finish: "Silver" | "Orange" | "Deep Blue") => {
  const finishKey = {
    Silver: "silver",
    Orange: "cosmicorange",
    "Deep Blue": "deepblue",
  }[finish];

  return `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-${finishKey}-202509?wid=1200&hei=1200&fmt=png-alpha`;
};

const products = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    brand: "Apple",
    category: "Smartphones",
    description:
      "Titanium design, A19 Pro chip, and a pro camera system built for anything you shoot.",
    heroImage: appleIphone17Image("Silver"),
    finishes: ["Silver", "Orange", "Deep Blue"],
    variants: [
      {
        variantLabel: "256GB Silver",
        storage: "256GB",
        color: "Silver",
        mrp: 134900,
        price: 127400,
        image: appleIphone17Image("Silver"),
        images: [
          appleIphone17Image("Silver"),
          appleIphone17Image("Orange"),
          appleIphone17Image("Deep Blue"),
        ],
      },
      {
        variantLabel: "256GB Orange",
        storage: "256GB",
        color: "Orange",
        mrp: 134900,
        price: 127400,
        image: appleIphone17Image("Orange"),
        images: [
          appleIphone17Image("Orange"),
          appleIphone17Image("Silver"),
          appleIphone17Image("Deep Blue"),
        ],
      },
      {
        variantLabel: "512GB Deep Blue",
        storage: "512GB",
        color: "Deep Blue",
        mrp: 154900,
        price: 146400,
        image: appleIphone17Image("Deep Blue"),
        images: [
          appleIphone17Image("Deep Blue"),
          appleIphone17Image("Silver"),
          appleIphone17Image("Orange"),
        ],
      },
    ],
  },
  {
    name: "Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    brand: "Samsung",
    category: "Smartphones",
    description:
      "A titanium frame, 200MP camera, and a built-in S Pen for a phone that doubles as a notebook.",
    heroImage: imageUrls.samsungBlack,
    finishes: ["Titanium Black", "Titanium Gray"],
    variants: [
      {
        variantLabel: "256GB Titanium Black",
        storage: "256GB",
        color: "Titanium Black",
        mrp: 129999,
        price: 119999,
        image: imageUrls.samsungBlack,
        images: [imageUrls.samsungBlack, imageUrls.samsungGray],
      },
      {
        variantLabel: "512GB Titanium Gray",
        storage: "512GB",
        color: "Titanium Gray",
        mrp: 144999,
        price: 134999,
        image: imageUrls.samsungGray,
        images: [imageUrls.samsungGray, imageUrls.samsungBlack],
      },
    ],
  },
  {
    name: "OnePlus 13",
    slug: "oneplus-13",
    brand: "OnePlus",
    category: "Smartphones",
    description:
      "Snapdragon 8 Elite performance with Hasselblad-tuned cameras and 100W fast charging.",
    heroImage: imageUrls.oneplusOcean,
    finishes: ["Midnight Ocean", "Arctic Dawn"],
    variants: [
      {
        variantLabel: "256GB Midnight Ocean",
        storage: "256GB",
        color: "Midnight Ocean",
        mrp: 69999,
        price: 64999,
        image: imageUrls.oneplusOcean,
        images: [imageUrls.oneplusOcean, imageUrls.oneplusDawn],
      },
      {
        variantLabel: "512GB Arctic Dawn",
        storage: "512GB",
        color: "Arctic Dawn",
        mrp: 79999,
        price: 74999,
        image: imageUrls.oneplusDawn,
        images: [imageUrls.oneplusDawn, imageUrls.oneplusOcean],
      },
    ],
  },
];

const emiPlanTemplates = [
  { tenureMonths: 3, interestRate: 0, cashback: 3000, order: 1 },
  { tenureMonths: 6, interestRate: 0, cashback: 3000, order: 2 },
  { tenureMonths: 12, interestRate: 0, cashback: 3000, order: 3 },
  { tenureMonths: 24, interestRate: 0, cashback: 3000, order: 4 },
  { tenureMonths: 36, interestRate: 10.5, cashback: 3000, order: 5 },
  { tenureMonths: 48, interestRate: 10.5, cashback: 3000, order: 6 },
  { tenureMonths: 60, interestRate: 10.5, cashback: 3000, order: 7 },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured. Add it to .env before seeding.");
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    await Promise.all([Product.deleteMany({}), EmiPlanTemplate.deleteMany({})]);
    await Promise.all([
      Product.insertMany(products),
      EmiPlanTemplate.insertMany(emiPlanTemplates),
    ]);

    console.log(`Seeded ${products.length} products and ${emiPlanTemplates.length} EMI plans.`);
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seeding error";
  console.error(message);
  process.exitCode = 1;
});
