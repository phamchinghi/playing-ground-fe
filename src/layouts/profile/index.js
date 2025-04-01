// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
// import ProfilesList from "examples/Lists/ProfilesList";
// import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
// import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
// import profilesListData from "layouts/profile/data/profilesListData";

// Images
// import homeDecor1 from "assets/images/home-decor-1.jpg";
// import homeDecor2 from "assets/images/home-decor-2.jpg";
// import homeDecor3 from "assets/images/home-decor-3.jpg";
// import homeDecor4 from "assets/images/home-decor-4.jpeg";
// import team1 from "assets/images/team-1.jpg";
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";

import { useState, useEffect } from "react";
import AuthService from "../../service/AuthService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const defaultProfile = {
  fullName: "Alec M. Thompson",
  mobile: "(44) 123 1234 123",
  email: "alecthompson@mail.com",
  location: "USA",
};

function Overview() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // My code
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchUserData(user);
    }else {
      setLoading(false); // Nếu không có user, ngừng loading
      setError("No user found");
    }
  }, [navigate]);

  const fetchUserData = async (user) => {
    // Lấy userId từ localStorage
    const userId = user.id;
    const token = user.token;
    if (!userId) {
      setError('No user ID found in localStorage');
      setLoading(false);
      return;
    }

    try {
      // Gửi request GET đến backend với userId
      const response = await axios.get(`http://localhost:8082/playing-ground/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong header
        }
      });
      if (response.status === 200) {
        setUserData(response.data.response);// save user data into state
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setLoading(false);
    } catch (err) {
      if(err.status === 401 && err.response){
        localStorage.removeItem("user");
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."); // Hiển thị thông báo
        navigate("/login");
      }else{
        setError('Error fetching user data');
        setLoading(false);
        console.error(err);
      }
    }
  };
  const username = userData ? `${userData.username}` : "";
  const fullname = userData ? `${userData.firstname} ${userData.lastname}` : "????";
  const mobile = userData ? `${userData.phone}` : "????";
  const email = userData ? `${userData.email}` : "????";
  const created_At = userData ? `${userData.created_at}` : "????";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {currentUser ? (
        <Header 
          username={username} 
          role={currentUser ? currentUser.roles : "????"}
        >
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4}>
                {/* <PlatformSettings /> */}
              </Grid>
              <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="profile information"
                  info={{
                    fullName: fullname,
                    mobile: mobile,
                    email: email,
                    createdDate:created_At,
                  }}
                  action={{ route: "", tooltip: "Edit Profile" }}//action for button to open edit user
                  shadow={true}
                />
                <Divider orientation="vertical" sx={{ mx: 0 }} />
              </Grid>
              <Grid item xs={12} xl={4}>
                {/* <ProfilesList title="conversations" profiles={profilesListData} shadow={false} /> */}
              </Grid>
            </Grid>
          </MDBox>
        </Header>
      ) : (
        <Header>
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4}>
                {/* <PlatformSettings /> */}
              </Grid>
              <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="profile information"
                  description="Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                  info={{
                    fullName: "Alec M. Thompson",
                    mobile: "(44) 123 1234 123",
                    email: "alecthompson@mail.com",
                    location: "USA",
                  }}
                  social={[
                    {
                      link: "https://www.facebook.com/CreativeTim/",
                      icon: <FacebookIcon />,
                      color: "facebook",
                    },
                    {
                      link: "https://twitter.com/creativetim",
                      icon: <TwitterIcon />,
                      color: "twitter",
                    },
                    {
                      link: "https://www.instagram.com/creativetimofficial/",
                      icon: <InstagramIcon />,
                      color: "instagram",
                    },
                  ]}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
                <Divider orientation="vertical" sx={{ mx: 0 }} />
              </Grid>
              <Grid item xs={12} xl={4}>
                {/* <ProfilesList title="conversations" profiles={profilesListData} shadow={false} /> */}
              </Grid>
            </Grid>
          </MDBox>
          {/* <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox> */}
          {/* <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox> */}
        </Header>
      )}
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Overview;
