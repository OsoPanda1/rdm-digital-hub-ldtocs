import { Router } from "express";
import gamerRouter from "./gamer.routes.js";
import adminRouter from "./admin.routes.js";
import gatewayRouter from "./gateway.routes.js";
import audioRouter from "./audio.routes.js";

const dgRouter = Router();

dgRouter.use("/gamer", gamerRouter);
dgRouter.use("/admin", adminRouter);
dgRouter.use("/audio", audioRouter);
dgRouter.use("/", gatewayRouter);

export default dgRouter;
