require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery_management');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@grocery.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210'
    });

    console.log('Users created');

    const categories = await Category.insertMany([
      { name: 'Vegetables', description: 'Fresh organic vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400' },
      { name: 'Fruits', description: 'Seasonal fresh fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
      { name: 'Dairy', description: 'Milk, cheese, yogurt and more', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400' },
      { name: 'Beverages', description: 'Drinks and beverages', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400' },
      { name: 'Snacks', description: 'Chips, cookies and snacks', image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400' },
      { name: 'Grains', description: 'Rice, wheat and pulses', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
    ]);

    console.log('Categories created');

    const products = await Product.insertMany([

      // ================= VEGETABLES =================
      { name: 'Tomato', description: 'Fresh red tomatoes.', price: 40, category: categories[0]._id, stock: 150, minStockLevel: 30, unit: 'kg', images: ['https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400'] },
      { name: 'Onion', description: 'Fresh onions.', price: 30, category: categories[0]._id, stock: 200, minStockLevel: 50, unit: 'kg', images: ['https://images.unsplash.com/photo-1582515073490-dc7f6c9e41c9?w=400'] },
      { name: 'Potato', description: 'Farm fresh potatoes.', price: 25, category: categories[0]._id, stock: 250, minStockLevel: 60, unit: 'kg', images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'] },
      { name: 'Carrot', description: 'Crunchy carrots.', price: 50, category: categories[0]._id, stock: 120, minStockLevel: 25, unit: 'kg', images: ['https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400'] },
      { name: 'Cabbage', description: 'Green cabbage.', price: 35, category: categories[0]._id, stock: 90, minStockLevel: 20, unit: 'piece', images: ['https://images.unsplash.com/photo-1582515073490-39981397c445?w=400'] },
      { name: 'Cauliflower', description: 'Fresh cauliflower.', price: 45, category: categories[0]._id, stock: 80, minStockLevel: 15, unit: 'piece', images: ['https://images.unsplash.com/photo-1510626176961-4b37d0d0b4c3?w=400'] },
      { name: 'Spinach', description: 'Leafy spinach.', price: 20, category: categories[0]._id, stock: 140, minStockLevel: 30, unit: 'bundle', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'] },
      { name: 'Capsicum', description: 'Fresh capsicum.', price: 60, category: categories[0]._id, stock: 100, minStockLevel: 20, unit: 'kg', images: ['https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=400'] },
      { name: 'Brinjal', description: 'Fresh brinjal.', price: 40, category: categories[0]._id, stock: 110, minStockLevel: 25, unit: 'kg', images: ['https://images.unsplash.com/photo-1604908554025-5a8b5f5b5c0b?w=400'] },
      { name: 'Green Peas', description: 'Sweet peas.', price: 80, category: categories[0]._id, stock: 90, minStockLevel: 20, unit: 'kg', images: ['https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400'] },

      // ================= FRUITS =================
      { name: 'Apple', description: 'Red apples.', price: 120, category: categories[1]._id, stock: 200, minStockLevel: 40, unit: 'kg', images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'] },
      { name: 'Banana', description: 'Sweet bananas.', price: 50, category: categories[1]._id, stock: 180, minStockLevel: 30, unit: 'dozen', images: ['https://images.unsplash.com/photo-1574226516831-e1dff420e37c?w=400'] },
      { name: 'Mango', description: 'Juicy mangoes.', price: 300, category: categories[1]._id, stock: 100, minStockLevel: 20, unit: 'kg', images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'] },
      { name: 'Orange', description: 'Fresh oranges.', price: 80, category: categories[1]._id, stock: 150, minStockLevel: 25, unit: 'kg', images: ['https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400'] },
      { name: 'Pineapple', description: 'Sweet pineapple.', price: 90, category: categories[1]._id, stock: 60, minStockLevel: 10, unit: 'piece', images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400'] },
      { name: 'Grapes', description: 'Green grapes.', price: 70, category: categories[1]._id, stock: 140, minStockLevel: 20, unit: 'kg', images: ['https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400'] },
      { name: 'Watermelon', description: 'Refreshing watermelon.', price: 40, category: categories[1]._id, stock: 90, minStockLevel: 15, unit: 'piece', images: ['https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400'] },
      { name: 'Papaya', description: 'Healthy papaya.', price: 60, category: categories[1]._id, stock: 110, minStockLevel: 20, unit: 'kg', images: ['https://images.unsplash.com/photo-1615485737651-6a7b4c3c7c3b?w=400'] },
      { name: 'Strawberry', description: 'Fresh strawberries.', price: 200, category: categories[1]._id, stock: 70, minStockLevel: 15, unit: 'box', images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400'] },
      { name: 'Pomegranate', description: 'Juicy pomegranate.', price: 120, category: categories[1]._id, stock: 130, minStockLevel: 25, unit: 'kg', images: ['https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400'] },

      // ================= DAIRY =================
      { name: 'Milk', description: 'Fresh milk.', price: 60, category: categories[2]._id, stock: 50, minStockLevel: 10, unit: 'litre', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'] },
      { name: 'Paneer', description: 'Soft paneer.', price: 320, category: categories[2]._id, stock: 40, minStockLevel: 10, unit: 'kg', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },
      { name: 'Butter', description: 'Creamy butter.', price: 250, category: categories[2]._id, stock: 35, minStockLevel: 8, unit: '500g', images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'] },
      { name: 'Cheese', description: 'Cheese block.', price: 400, category: categories[2]._id, stock: 30, minStockLevel: 5, unit: 'kg', images: ['https://images.unsplash.com/photo-1585238342028-966c3f2b0d57?w=400'] },
      { name: 'Curd', description: 'Fresh curd.', price: 80, category: categories[2]._id, stock: 90, minStockLevel: 20, unit: 'kg', images: ['https://images.unsplash.com/photo-1590080874088-eec64895b423?w=400'] },
      { name: 'Greek Yogurt', description: 'Healthy yogurt.', price: 120, category: categories[2]._id, stock: 50, minStockLevel: 10, unit: 'cup', images: ['https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400'] },
      { name: 'Buttermilk', description: 'Refreshing chaas.', price: 30, category: categories[2]._id, stock: 100, minStockLevel: 20, unit: 'litre', images: ['https://images.unsplash.com/photo-1627919560087-7dca9c42b3b1?w=400'] },
      { name: 'Ice Cream', description: 'Vanilla ice cream.', price: 150, category: categories[2]._id, stock: 45, minStockLevel: 10, unit: '500ml', images: ['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'] },
      { name: 'Flavored Milk', description: 'Chocolate milk.', price: 90, category: categories[2]._id, stock: 60, minStockLevel: 12, unit: 'bottle', images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'] },
      { name: 'Cream', description: 'Fresh cream.', price: 200, category: categories[2]._id, stock: 25, minStockLevel: 5, unit: 'pack', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },

      // ================= BEVERAGES =================
      { name: 'Orange Juice', description: 'Fresh juice.', price: 90, category: categories[3]._id, stock: 35, minStockLevel: 7, unit: 'litre', images: ['https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400'] },
      { name: 'Apple Juice', description: 'Apple juice.', price: 100, category: categories[3]._id, stock: 40, minStockLevel: 8, unit: 'litre', images: ['https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400'] },
      { name: 'Cold Coffee', description: 'Iced coffee.', price: 120, category: categories[3]._id, stock: 30, minStockLevel: 5, unit: 'glass', images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400'] },
      { name: 'Lemonade', description: 'Lemon drink.', price: 50, category: categories[3]._id, stock: 60, minStockLevel: 12, unit: 'litre', images: ['https://images.unsplash.com/photo-1527169402691-a0a1d3c6c7c1?w=400'] },
      { name: 'Coconut Water', description: 'Natural coconut water.', price: 60, category: categories[3]._id, stock: 70, minStockLevel: 15, unit: 'piece', images: ['https://images.unsplash.com/photo-1598514982621-96c9f8d8d6d5?w=400'] },
      { name: 'Energy Drink', description: 'Energy booster.', price: 120, category: categories[3]._id, stock: 50, minStockLevel: 10, unit: 'can', images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400'] },
      { name: 'Green Tea', description: 'Healthy tea.', price: 150, category: categories[3]._id, stock: 35, minStockLevel: 7, unit: 'box', images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'] },
      { name: 'Iced Tea', description: 'Peach iced tea.', price: 90, category: categories[3]._id, stock: 55, minStockLevel: 10, unit: 'bottle', images: ['https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400'] },
      { name: 'Cola', description: 'Soft drink.', price: 40, category: categories[3]._id, stock: 100, minStockLevel: 20, unit: 'bottle', images: ['https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400'] },
      { name: 'Milkshake', description: 'Chocolate shake.', price: 130, category: categories[3]._id, stock: 25, minStockLevel: 5, unit: 'glass', images: ['https://images.unsplash.com/photo-1577801592517-9d8caa7f9e2b?w=400'] },

      // ================= SNACKS =================
      { name: 'Potato Chips', description: 'Crispy chips.', price: 35, category: categories[4]._id, stock: 200, minStockLevel: 50, unit: 'pack', images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'] },
      { name: 'Nachos', description: 'Cheesy nachos.', price: 70, category: categories[4]._id, stock: 120, minStockLevel: 25, unit: 'pack', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },
      { name: 'Popcorn', description: 'Butter popcorn.', price: 50, category: categories[4]._id, stock: 150, minStockLevel: 30, unit: 'pack', images: ['https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400'] },
      { name: 'Biscuits', description: 'Tea biscuits.', price: 40, category: categories[4]._id, stock: 180, minStockLevel: 40, unit: 'pack', images: ['https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400'] },
      { name: 'Cookies', description: 'Chocolate cookies.', price: 80, category: categories[4]._id, stock: 120, minStockLevel: 25, unit: 'pack', images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400'] },
      { name: 'Namkeen', description: 'Indian snack.', price: 60, category: categories[4]._id, stock: 140, minStockLevel: 30, unit: 'pack', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },
      { name: 'Chocolate Bar', description: 'Sweet chocolate.', price: 50, category: categories[4]._id, stock: 160, minStockLevel: 35, unit: 'piece', images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'] },
      { name: 'Cake Slice', description: 'Fresh cake.', price: 90, category: categories[4]._id, stock: 60, minStockLevel: 10, unit: 'piece', images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'] },
      { name: 'Samosa', description: 'Crispy samosa.', price: 20, category: categories[4]._id, stock: 100, minStockLevel: 20, unit: 'piece', images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'] },
      { name: 'Kachori', description: 'Spicy kachori.', price: 25, category: categories[4]._id, stock: 90, minStockLevel: 20, unit: 'piece', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },

      // ================= GRAINS =================
      { name: 'Basmati Rice', description: 'Premium rice.', price: 120, category: categories[5]._id, stock: 300, minStockLevel: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'] },
      { name: 'Wheat Flour', description: 'Atta.', price: 50, category: categories[5]._id, stock: 250, minStockLevel: 60, unit: 'kg', images: ['https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400'] },
      { name: 'Toor Dal', description: 'Arhar dal.', price: 140, category: categories[5]._id, stock: 200, minStockLevel: 50, unit: 'kg', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },
      { name: 'Moong Dal', description: 'Healthy dal.', price: 130, category: categories[5]._id, stock: 180, minStockLevel: 40, unit: 'kg', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },
      { name: 'Chana Dal', description: 'Split gram.', price: 110, category: categories[5]._id, stock: 170, minStockLevel: 40, unit: 'kg', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },
      { name: 'Sugar', description: 'Refined sugar.', price: 45, category: categories[5]._id, stock: 220, minStockLevel: 50, unit: 'kg', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'] },
      { name: 'Salt', description: 'Iodized salt.', price: 20, category: categories[5]._id, stock: 300, minStockLevel: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'] },
      { name: 'Poha', description: 'Flattened rice.', price: 60, category: categories[5]._id, stock: 150, minStockLevel: 30, unit: 'kg', images: ['https://images.unsplash.com/photo-1604908176997-4310e7b8b6b1?w=400'] },
      { name: 'Oats', description: 'Healthy oats.', price: 90, category: categories[5]._id, stock: 140, minStockLevel: 25, unit: 'kg', images: ['https://images.unsplash.com/photo-1585238342028-966c3f2b0d57?w=400'] },
      { name: 'Corn Flour', description: 'Fine flour.', price: 70, category: categories[5]._id, stock: 120, minStockLevel: 20, unit: 'kg', images: ['https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400'] }

    ]);

    console.log('Products created');
    console.log('\nSeed completed successfully!');
    console.log('\nAdmin Login: admin@grocery.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
