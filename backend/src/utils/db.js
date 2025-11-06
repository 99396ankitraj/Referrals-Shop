import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/referral_credit_app';
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
  console.log('MongoDB connected');
};

export const seedProductsIfEmpty = async () => {
  const defaults = [
    {
      name: 'Digital Hoodie',
      description: 'Cozy, minimalist hoodie mockup for your brand.',
      price: 49.0,
      imageUrl: 'https://images.unsplash.com/photo-1520975682031-a7e87ddb3b43?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Portfolio Template',
      description: 'Modern portfolio website template for freelancers.',
      price: 29.0,
      imageUrl: 'https://images.unsplash.com/photo-1529336953121-ad3f8f6f1011?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Icon Pack',
      description: 'Beautiful vector icon pack for apps and websites.',
      price: 15.0,
      imageUrl: 'https://images.unsplash.com/photo-1506634064465-9c56a2ec6a3b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'UI Kit Pro',
      description: 'Premium UI component library for web apps.',
      price: 39.0,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Landing Page Template',
      description: 'High-converting landing page template.',
      price: 35.0,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Illustration Pack',
      description: 'Hand-drawn illustrations for startups.',
      price: 25.0,
      imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Resume Template',
      description: 'ATS-friendly resume and cover letter templates.',
      price: 12.0,
      imageUrl: 'https://images.unsplash.com/photo-1516382799247-87df7e57f658?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Mobile App Icons',
      description: 'Curated icons optimized for iOS and Android.',
      price: 19.0,
      imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Social Media Kit',
      description: 'Editable templates for posts and stories.',
      price: 22.0,
      imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  let inserted = 0;
  for (const p of defaults) {
    const res = await Product.updateOne(
      { name: p.name },
      { $set: { imageUrl: p.imageUrl }, $setOnInsert: { description: p.description, price: p.price, name: p.name } },
      { upsert: true }
    );
    if (res.upsertedCount && res.upsertedCount > 0) inserted += res.upsertedCount;
  }
  if (inserted > 0) console.log(`Seeded ${inserted} product(s)`);
};
