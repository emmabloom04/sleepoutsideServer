import mongodb from "../database/index.mts";
import type { Alert } from "./types.mts";
import type { Collection } from "mongodb";

async function getAllAlerts(): Promise<Alert[]> {
    const alertsCollection: Collection<Alert> = mongodb.getDb().collection<Alert>('alerts');
    const alerts = await alertsCollection.find({ status: "active" }).toArray();

    return alerts;
}

export default {
  getAllAlerts
};