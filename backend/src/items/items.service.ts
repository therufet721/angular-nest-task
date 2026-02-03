import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { PaginateModel, PaginateResult } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class ItemsService implements OnModuleInit {
  constructor(
    @InjectModel(Item.name) private itemModel: PaginateModel<ItemDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  // Seed mock data on module initialization
  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    // Check if data already exists
    const itemCount = await this.itemModel.countDocuments();
    if (itemCount > 0) {
      return; // Data already seeded
    }

    // Create categories
    const categories = await this.categoryModel.insertMany([
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Books', description: 'Physical and digital books' },
      { name: 'Clothing', description: 'Apparel and accessories' },
      { name: 'Home & Garden', description: 'Home improvement and gardening supplies' },
      { name: 'Sports', description: 'Sports equipment and accessories' },
    ]);

    // Create mock items
    const mockItems = [
      { name: 'Laptop Pro', description: 'High-performance laptop', price: 1299.99, quantity: 50, category: categories[0]._id },
      { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, quantity: 200, category: categories[0]._id },
      { name: 'USB-C Hub', description: '7-in-1 USB-C hub', price: 49.99, quantity: 150, category: categories[0]._id },
      { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 89.99, quantity: 75, category: categories[0]._id },
      { name: '4K Monitor', description: '27-inch 4K display', price: 399.99, quantity: 30, category: categories[0]._id },
      { name: 'JavaScript Mastery', description: 'Complete JS guide', price: 39.99, quantity: 100, category: categories[1]._id },
      { name: 'Clean Code', description: 'Software craftsmanship book', price: 34.99, quantity: 80, category: categories[1]._id },
      { name: 'Design Patterns', description: 'Gang of Four patterns', price: 44.99, quantity: 60, category: categories[1]._id },
      { name: 'TypeScript Handbook', description: 'TypeScript reference', price: 29.99, quantity: 120, category: categories[1]._id },
      { name: 'Angular in Action', description: 'Angular framework guide', price: 49.99, quantity: 40, category: categories[1]._id },
      { name: 'Cotton T-Shirt', description: 'Comfortable cotton tee', price: 19.99, quantity: 500, category: categories[2]._id },
      { name: 'Denim Jeans', description: 'Classic fit jeans', price: 59.99, quantity: 200, category: categories[2]._id },
      { name: 'Running Shoes', description: 'Lightweight running shoes', price: 79.99, quantity: 150, category: categories[2]._id },
      { name: 'Winter Jacket', description: 'Warm winter jacket', price: 129.99, quantity: 75, category: categories[2]._id },
      { name: 'Baseball Cap', description: 'Adjustable baseball cap', price: 24.99, quantity: 300, category: categories[2]._id },
      { name: 'Garden Tools Set', description: '10-piece garden set', price: 49.99, quantity: 100, category: categories[3]._id },
      { name: 'Indoor Plant Pot', description: 'Ceramic plant pot', price: 19.99, quantity: 250, category: categories[3]._id },
      { name: 'LED Grow Light', description: 'Full spectrum grow light', price: 59.99, quantity: 80, category: categories[3]._id },
      { name: 'Outdoor Chair', description: 'Weather-resistant chair', price: 89.99, quantity: 60, category: categories[3]._id },
      { name: 'Bird Feeder', description: 'Hanging bird feeder', price: 29.99, quantity: 150, category: categories[3]._id },
      { name: 'Yoga Mat', description: 'Non-slip yoga mat', price: 29.99, quantity: 200, category: categories[4]._id },
      { name: 'Dumbbells Set', description: 'Adjustable dumbbells', price: 149.99, quantity: 50, category: categories[4]._id },
      { name: 'Tennis Racket', description: 'Professional racket', price: 79.99, quantity: 80, category: categories[4]._id },
      { name: 'Basketball', description: 'Official size basketball', price: 24.99, quantity: 120, category: categories[4]._id },
      { name: 'Fitness Tracker', description: 'Smart fitness band', price: 69.99, quantity: 100, category: categories[4]._id },
    ];

    await this.itemModel.insertMany(mockItems);
    console.log('Mock data seeded successfully!');
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginateResult<ItemDocument>> {
    const options = {
      page,
      limit,
      populate: 'category',
      sort: { createdAt: -1 },
    };

    return this.itemModel.paginate({}, options);
  }
}
