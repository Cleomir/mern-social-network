import mongoose from "mongoose";

/**
 *
 * @param dbUrl - Mongo database URL
 */
const connectToDB = async (dbUrl: string): Promise<typeof mongoose> => {
  return mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectToDB;
