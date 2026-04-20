import MainLayout from "Components/MainLayout";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const adminToken = true
    return (
        <>
            {
                adminToken ?
                    <MainLayout />
                    :
                    <Navigate to='/' />
            }
        </>
    )
}

export default ProtectedRoutes