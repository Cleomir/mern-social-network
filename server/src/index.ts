import { inspect } from "util";

import app from "./App";
import { env } from "./config/envVariables";
import connectToDB from "./db/connection";
import logger, { logObject } from "./logger";

// bootstrap
(async () => {
  try {
    await connectToDB(env.DB_URL);
    logger.info("[DB] Connected");
  } catch (error) {
    logObject("error", `[DB] Connection error`, error);
  }
})();

const serverPort: number = +env.SERVER_PORT;
/**
 * Start server
 */
app.listen(serverPort, () =>
  logger.info(`[NODE] Started on port ${serverPort}`)
);
