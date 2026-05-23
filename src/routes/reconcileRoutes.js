import express from "express";

import { reconcileTransactions } from "../controllers/reconcileController.js";

const router = express.Router();

router.post(
    "/reconcile",
    reconcileTransactions
);

export default router;