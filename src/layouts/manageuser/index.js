// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import avatar from "assets/images/user.png";
import MDAvatar from "../../components/MDAvatar";
import MDButton from "components/MDButton";
// Data
import MDBadge from "../../components/MDBadge";
// React
import { useEffect, useState, useMemo } from "react";
// Axios
import axios from "axios";
import { useAuth } from "../../service/AuthContext";
// Thêm các import cần thiết cho Modal
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MDInput from "components/MDInput";
import { useTheme } from "@mui/material/styles";
import Loader from "../../components/Custom/Loader";

function ManageUser() {
  const [rawUsers, setRawUsers] = useState([]); // Dữ liệu thô từ API
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { Header: "id", accessor: "id", align: "left", hide: true },
    { Header: "author", accessor: "author", width: "25%", align: "left" },
    { Header: "phone", accessor: "phone", align: "center" },
    { Header: "role", accessor: "function", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "employed", accessor: "employed", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { currentUser } = useAuth();
  const theme = useTheme(); // Lấy theme hiện tại (light/dark)

  // Chuyển dữ liệu thô thành dữ liệu hiển thị với useMemo
  const users = useMemo(() => {
    return rawUsers.map((user) => ({
      id: user.id,
      author: (
        <Author
          image={avatar}
          name={`${user.firstname} ${user.lastname}`}
          email={user.email}
        />
      ),
      phone: user.phone,
      function: <Job title={user.roles[0]} />,
      status: (
        <MDBadge
          badgeContent={user.is_active ? "Active" : "Inactive"}
          color={user.is_active ? "success" : "secondary"}
          variant="gradient"
          size="sm"
        />
      ),
      employed: new Date(user.created_at).toLocaleDateString(),
      action: (
        <MDButton
          variant="gradient"
          color="success"
          fontWeight="medium"
          onClick={() => handleEdit(user)}
        >
          Edit
        </MDButton>
      ),
    }));
  }, [rawUsers]);

  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser);
    } else {
      setLoading(false); // Nếu không có user, ngừng loading
      setError("No user found");
    }
  }, [currentUser]);

  const fetchUserData = async (user) => {
    // Gọi API để lấy dữ liệu user
    try {
      const response = await axios.get(
        "http://localhost:8082/playing-ground/user/getAllUser",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        setRawUsers(response.data.response); // Lưu dữ liệu thô
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user); // Lưu thông tin user cần sửa
    setIsEditModalOpen(true);
  };
  // Handle input changes trong Modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    if (!currentUser || !currentUser.token) {
      alert("Please login to perform this action!");
      return;
    }
    const updateData = {
      id: selectedUser.userId,
      username: selectedUser.username,
      email: selectedUser.email || "",
      firstname: selectedUser.firstname || "",
      lastname: selectedUser.lastname || "",
      phone: selectedUser.phone || "",
    };

    try {
      const response = await axios.put(
        "http://localhost:8082/playing-ground/user/update",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Sử dụng token từ state
          },
        }
      );
      // Update list user
      if (response.status === 200) {
        setRawUsers((prevRawUsers) =>
          prevRawUsers.map((u) =>
            u.userId === selectedUser.userId ? { ...u, ...selectedUser } : u
          )
        );
        alert("User updated successfully!");
        setIsEditModalOpen(false); // Đóng popup sau khi lưu
      }
    } catch (error) {
      console.error("Update failed", error);
      alert(
        error.response?.data?.message ||
          "Failed to update user. Please try again."
      );
    }
  };

  // Style cho Modal
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: theme.palette.background.paper, // use background color from theme
    boxShadow: theme.shadows[24], // Shadow from theme
    p: 4,
    borderRadius: "8px",
    border: `1px solid ${theme.palette.divider}`, // border follow theme
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  All Users
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                    <div>
                      <Loader /> {/* Spinner từ Material-UI */}
                    </div>
                ) : error ? (
                  <MDTypography color="error">{error}</MDTypography>
                ) : (
                  <DataTable
                    table={{ columns, rows: users }}
                    isSorted={false}
                    entriesPerPage={true}
                    showTotalEntries={true}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* Modal Edit Form */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <MDTypography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            mb={3}
            color={theme.palette.text.primary} //character color follow theme
          >
            Edit User
          </MDTypography>
          {selectedUser && (
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  label="First Name"
                  name="firstname"
                  value={selectedUser.firstname || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: theme.palette.text.secondary }, //input border follow theme
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: theme.palette.divider, //input border follow theme
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.primary,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary, // make sure text input always clear
                    },
                  }}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  label="Last Name"
                  name="lastname"
                  value={selectedUser.lastname || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: theme.palette.text.secondary },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.primary,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary, // make sure text input always clear
                    },
                  }}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  label="Email"
                  name="email"
                  value={selectedUser.email || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled // DO not allow edit
                  InputLabelProps={{
                    style: { color: theme.palette.text.secondary },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary, // make sure text input always clear
                    },
                  }}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={selectedUser.phone || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: theme.palette.text.secondary },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.primary,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary, // make sure text input always clear
                    },
                  }}
                />
              </MDBox>
              <MDBox display="flex" justifyContent="space-between" mt={3}>
                <MDButton
                  variant="contained"
                  color="error"
                  sx={{
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.error.dark,
                    },
                  }}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </MDButton>
                <MDButton
                  variant="contained"
                  color="success"
                  sx={{
                    backgroundColor: theme.palette.success.main,
                    color: theme.palette.success.primary,
                    "&:hover": {
                      backgroundColor: theme.palette.success.dark,
                    },
                  }}
                  onClick={handleSave}
                >
                  Save
                </MDButton>
              </MDBox>
            </MDBox>
          )}
        </Box>
      </Modal>
      <Footer />
    </DashboardLayout>
  );
}
const Author = ({ image, name, email }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDAvatar src={image} name={name} size="sm" />
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{email}</MDTypography>
    </MDBox>
  </MDBox>
);

const Job = ({ title }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography
      display="block"
      variant="caption"
      color="text"
      fontWeight="medium"
    >
      {title}
    </MDTypography>
  </MDBox>
);

export default ManageUser;
