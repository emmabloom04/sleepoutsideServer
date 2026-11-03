import { Router } from "express";
import alertService from "../services/alerts.service.mts";

const router: Router = Router();

router.get("/", async (req, res, next) => {
    try {
        const alerts = await alertService.getAllAlerts();
        res.status(200).json(alerts);
    } catch (error) {
        next(error);
    }
});

export default router; 