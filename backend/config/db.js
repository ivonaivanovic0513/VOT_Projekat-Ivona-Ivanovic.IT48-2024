import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import users from '../data/users.js';
import products from '../data/products.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/egazdinstvo';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.log(`Lokalni MongoDB nije dostupan: ${error.message}`);
    console.log('Pokrećem privremenu in-memory bazu...');
  }

  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri('egazdinstvo');
  const conn = await mongoose.connect(memoryUri);
  console.log(`MongoDB Connected (in-memory): ${conn.connection.host}`);
};

const seedDatabase = async () => {
  const productCount = await Product.countDocuments();

  if (productCount > 0) {
    return;
  }

  await User.deleteMany();
  await Product.deleteMany();

  const createdUsers = await User.insertMany(users);
  const adminUser = createdUsers[0]._id;
  const sampleProducts = products.map((product) => ({
    ...product,
    user: adminUser,
  }));

  await Product.insertMany(sampleProducts);
  console.log('Test podaci su uvezeni u bazu.');
};

export { connectDB, seedDatabase, memoryServer };
