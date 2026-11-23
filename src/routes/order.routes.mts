import { Router } from "express";
import authorize from "../middleware/authorize.mts";
import orderService from "../services/order.service.mts";

const router = Router();

router.post("/", authorize, async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const order = await orderService.createOrder(userId, req.body);
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

export default router;