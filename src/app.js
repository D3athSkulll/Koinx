import express from "express";

import reconcileRoutes from "./routes/reconcileRoutes.js"

const app = express();

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/health",(req, res)=>{
    return res.status(200).json({
        status: "ok",
    });
});

app.use("/api", reconcileRoutes);

export default app;