import { Router, type IRouter } from "express";
import healthRouter from "./health";
import territoryRouter from "./territory";

const router: IRouter = Router();

router.use(healthRouter);
router.use(territoryRouter);

export default router;
