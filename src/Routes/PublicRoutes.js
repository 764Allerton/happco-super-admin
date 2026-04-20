import { Layout } from "antd";
// import LanguageSelect from "Components/LanguageSelect";
import ThemeSelect from "Components/ThemeSelect";
import React from "react";
import { Outlet } from "react-router-dom";

const PublicRoutes = () => {

    return (
        <>
            <Layout className="overflow-y-hidden" style={{ height: "100vh" }}>
                <Layout.Header className={`headerStyleAuth sticky z-50 top-0`} >
                    <div className="flex justify-end gap-5" >
                        <div className="flexCenter gap-3"><ThemeSelect /></div>
                        {/* <div className="flexCenter"><LanguageSelect /></div> */}
                    </div>
                </Layout.Header>
                <Layout.Content className="jn" >
                    <Outlet />
                </Layout.Content>
            </Layout>
        </>
    )
}

export default PublicRoutes