import mongoose from 'mongoose';
import config from './config.js';

const dbConnect = () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('Database already connected');
      return;
    }
    mongoose.connect(config.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log(`Database connected established`);
    // mongoose debugger
    mongoose.set('debug', true);
  } catch (error) {
    console.log(`Database connection failed`);
  }
};

export default dbConnect;
