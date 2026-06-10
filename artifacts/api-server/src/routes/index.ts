import { Router, type IRouter } from "express";
import healthRouter from "./health";
import settingsRouter from "./settings";
import heroRouter from "./hero";
import aboutRouter from "./about";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import galleryRouter from "./gallery";
import blogsRouter from "./blogs";
import testimonialsRouter from "./testimonials";
import contactRouter from "./contact";
import inquiriesRouter from "./inquiries";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(settingsRouter);
router.use(heroRouter);
router.use(aboutRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(galleryRouter);
router.use(blogsRouter);
router.use(testimonialsRouter);
router.use(contactRouter);
router.use(inquiriesRouter);
router.use(authRouter);
router.use(dashboardRouter);

export default router;
