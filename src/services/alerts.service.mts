import alertModel from "../models/alert.model.mts";

const getAllAlerts = async () => {
    const alerts = await alertModel.getAllAlerts();
    return alerts;
};

export default {
    getAllAlerts
};  