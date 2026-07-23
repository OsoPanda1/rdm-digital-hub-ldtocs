import app from "./app";
import { logger } from "./lib/logger";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(PORT, "0.0.0.0", () => {
  logger.info({ port: PORT }, "RDM Heptafederation API Gateway listening");
});
