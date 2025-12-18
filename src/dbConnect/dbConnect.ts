import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri:any = process.env.MONGODB_URI;
    
    await mongoose.connect(mongoUri);

    // console.log("Mongo ::::", mongoUri)
    console.log('MongoDB connected successfully');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});