import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnalyticsTracker from "../components/AnalyticsTracker.jsx";

const MainLayout = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      <AnalyticsTracker />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
