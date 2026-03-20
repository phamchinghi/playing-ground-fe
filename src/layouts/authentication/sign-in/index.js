import { useEffect, useState } from "react";
// react-router-dom components
import { Link } from "react-router-dom";
// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

//==============My import===============
import { useNavigate } from "react-router-dom";
import AuthService from "../../../service/AuthService";
import MDSnackbar from "components/MDSnackbar";
import Loader from "components/Custom/Loader";


function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorSB, setErrorSB] = useState(false);

  const closeErrorSB = () => setErrorSB(false);

  const navigate = useNavigate();


  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    console.log("Form submitted!");
    console.log("Username:", username); // Kiểm tra giá trị username
    console.log("Password:", password);

    AuthService.login(username, password).then(
      (response) => {
        navigate(response.response.roles[0] === "ADMIN" ? "/dashboard" : "/home");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.response &&
            error.response.response.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };


  useEffect(() => {
    // My code
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      setLoading(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  }, [navigate]);

  return (
    <BasicLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={3}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Welcome to PG app
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput 
              type="text" 
              label="User Name" 
              value = {username}
              onChange = {(e) => setUsername(e.target.value)}
              fullWidth />
            </MDBox>
            {
              message && (
              <MDSnackbar
                color="error"
                icon="warning"
                title="Error"
                content={message}
                dateTime="11 mins ago"
                open={errorSB}
                onClose={closeErrorSB}
                close={closeErrorSB}
                bgWhite
              />
            )}
            <MDBox mb={2}>
              <MDInput 
              type="password" 
              label="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" type="submit" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      {loading && (
        <div>
          <Loader /> {/* Spinner từ Material-UI */}
        </div>
      )}
    </BasicLayout>
  );
}

Login.defaultProps = {

}

export default Login;
