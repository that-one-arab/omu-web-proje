import React from "react";
import authRoutes from "./auth";

const safeRoutes = [
    {
        path: "/login",
        exact: true,
        name: "Home",
        component: React.lazy(() => import("../../pages/login/Login")),
    },
];

export { authRoutes, safeRoutes };
