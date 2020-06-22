import app from "./App";
import { DB_URL, SERVER_PORT } from "./config/envVariables";
import connectToDB from "./db/connection";
import logger from "./logger";

/**
 * Initial database connection
 */
(async () => {
  try {
    await connectToDB(DB_URL);
    logger.info("Successfully connected to db");
  } catch (error) {
    logger.error("Could not connect to db.", error);
  }
})();

/**
 * Start server
 */
app.listen(SERVER_PORT, () =>
  logger.info(`server listening on port ${SERVER_PORT}`)
);
