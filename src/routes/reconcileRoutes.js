import express from "express";

import { reconcileController, ingestTransactions } from "../controllers/reconcileController.js";

const router = express.Router();

router.post(
    "/reconcile",
    reconcileController
);
router.post(
    "/ingest",
    ingestTransactions
);
export default router;