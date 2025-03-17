import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Home() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={3} textAlign="center">
        <MDTypography variant="h2" fontWeight="bold">
          Welcome to the Home Page!
        </MDTypography>
        <MDTypography variant="body1" color="text" mt={2}>
          This is the main content area of your application.
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
}

export default Home;
