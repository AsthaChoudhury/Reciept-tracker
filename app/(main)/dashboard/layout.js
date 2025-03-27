import React, { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

const DashboardLayout = () => {
  return (
    <div className="px-5 min-h-screen flex flex-col items-center justify-start mt-20">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-300 bg-clip-text text-transparent mb-5">
        DashBoard
      </h1>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
