import { Router } from "express";
import productRoutes from "./product.routes.mts";
import swaggerRoutes from "./swagger.routes.mts";
import userRoutes from "./user.routes.mts";
import alertRoutes from "./alert.routes.mts";
import subscriberRoutes from "./subscriber.routes.mts";

const router:Router = Router();

// The home page route
router.get("/", (req, res) => {
  res.json({ title: "API V1" });
});

// load products routes
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/alerts", alertRoutes);
router.use("/subscribers", subscriberRoutes);

// load swagger routes
router.use(swaggerRoutes);


export default router;

