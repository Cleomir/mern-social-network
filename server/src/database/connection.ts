import mongoose from "mongoose";
import logger from "../logger";

/**
 * Connect to MongoDB
 * @param dbUrl Mongo database URL
 */
const connectToDB = async (dbUrl: string): Promise<void> => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  logger.info("[MONGO] Connected");
};

export default connectToDB;
