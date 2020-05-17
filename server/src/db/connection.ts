import mongoose from "mongoose";

/**
 * Connect to MongoDB
 * @param dbUrl Mongo database URL
 */
const connectToDB = async (dbUrl: string): Promise<typeof mongoose> => {
  return mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};

export default connectToDB;
