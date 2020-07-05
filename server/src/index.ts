import app from "./App";
import { env } from "./config/envVariables";
import connectToDB from "./database/connection";
import logger, { logObject } from "./logger";

// bootstrap
(async () => {
  try {
    await connectToDB(env.DB_URL);
  } catch (error) {
    logObject("error", `[MONGO] Connection error`, error);
  }
})();

const serverPort: number = +env.SERVER_PORT;
/**
 * Start server
 */
app.listen(serverPort, () =>
  logger.info(`[NODE] Started on port ${serverPort}`)
);
