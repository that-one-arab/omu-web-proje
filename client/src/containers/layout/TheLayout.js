import React from "react";
import Sidebar from "../sidebar/TheSidebar";
import Header from "../header/TheHeader";
import Footer from "../footer/TheFooter";
import Content from "../content/TheContent";

const Layout = () => {
  return (
    <div className="c-app c-default-layout">
      <Sidebar />
      <div className="c-wrapper">
        <Header />
        <div className="c-body">
          <Content />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
