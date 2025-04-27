import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Avatar,
  Typography,
  Box,
  Container,
  Grid,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Divider,
  Fade,
  Grow,
  Zoom,
  Slide,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import Sidebar from "../navigation pane/Sidebar";
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Cake as CakeIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CameraAlt as CameraAltIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";

// Custom theme with beautiful colors
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode colors
          primary: {
            main: "#3f51b5",
            light: "#757de8",
            dark: "#002984",
            contrastText: "#fff",
          },
          secondary: {
            main: "#f50057",
            light: "#ff4081",
            dark: "#c51162",
            contrastText: "#fff",
          },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
          text: {
            primary: "#212121",
            secondary: "#757575",
          },
        }
      : {
          // Dark mode colors
          primary: {
            main: "#bb86fc",
            light: "#d1c4e9",
            dark: "#3700b3",
            contrastText: "#000",
          },
          secondary: {
            main: "#03dac6",
            light: "#66fff9",
            dark: "#00a895",
            contrastText: "#000",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          text: {
            primary: "#e0e0e0",
            secondary: "#a0a0a0",
          },
        }),
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 150,
          height: 150,
          fontSize: "3.5rem",
          border: "3px solid",
          borderColor: mode === "light" ? "#3f51b5" : "#bb86fc",
          boxShadow:
            mode === "light"
              ? "0 4px 12px rgba(0,0,0,0.1)"
              : "0 4px 12px rgba(0,0,0,0.3)",
        },
      },
    },
  },
});

// Date formatting utility function
const formatDate = (dateString) => {
  if (!dateString) return "Not provided";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

function UserProfile() {
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Theme configuration
  const appTheme = createTheme(getDesignTokens(darkMode ? "dark" : "light"));

  // Load user data and preferences
  useEffect(() => {
    const loadUserData = async () => {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      if (!loggedUser) {
        navigate("/login");
      } else {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:8080/users/${loggedUser.id}`
          );
          setUser(response.data);
          setUpdatedUser(response.data);
          setIsFollowing(response.data.isFollowing || false);
          setFollowersCount(response.data.followers || 0);
          setFollowingCount(response.data.following || 0);
        } catch (error) {
          showSnackbar("Error loading user data", "error");
        } finally {
          setLoading(false);
        }
      }
    };


  };

  const handleDelete = async () => {
    if (!user?.id) return;

    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/users/${user.id}`);
      localStorage.removeItem("user");
      showSnackbar("Profile deleted successfully", "success");
      navigate("/");
    } catch (error) {
      showSnackbar("Error deleting profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    if (!file.type.match("image.*")) {
      showSnackbar("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("Image size should be less than 5MB", "error");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `http://localhost:8080/users/${user.id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      showSnackbar("Profile picture updated successfully", "success");
    } catch (error) {
      showSnackbar("Error uploading image", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await axios.put(
        `http://localhost:8080/users/${user.id}/${endpoint}`
      );

      const newFollowersCount = isFollowing
        ? followersCount - 1
        : followersCount + 1;
      const updatedUserData = { ...user, followers: newFollowersCount };

      setUser(updatedUserData);
      setUpdatedUser(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setIsFollowing(!isFollowing);
      setFollowersCount(newFollowersCount);

      showSnackbar(
        isFollowing ? "Unfollowed successfully" : "Followed successfully",
        "success"
      );
    } catch (error) {
      showSnackbar("Error updating follow status", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box display="flex" minHeight="100vh">
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: { sm: "30px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            background: appTheme.palette.background.default,
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Dark Mode Toggle */}
            <Fade in={true} timeout={800}>
              <Box display="flex" justifyContent="flex-end">
                <IconButton
                  onClick={toggleDarkMode}
                  color="inherit"
                  sx={{
                    backgroundColor: appTheme.palette.background.paper,
                    boxShadow: appTheme.shadows[2],
                    "&:hover": {
                      backgroundColor: appTheme.palette.action.hover,
                    },
                  }}
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Box>
            </Fade>

            {loading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress color="secondary" />
              </Box>
            )}

            {
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        {/* Profile Picture Upload */}
                        <Zoom in={true} timeout={1200}>
                          <Box
                            sx={{
                              position: "relative",
                              mb: 2,
                              "&:hover .camera-icon": {
                                opacity: 1,
                              },
                            }}
                          >
                            <label htmlFor="profile-image-upload">
                              <input
                                id="profile-image-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                              />
                              <IconButton
                                component="span"
                                disabled={loading}
                                sx={{
                                  position: "absolute",
                                  bottom: 8,
                                  right: 8,
                                  backgroundColor:
                                    appTheme.palette.primary.main,
                                  color: "white",
                                  opacity: 0,
                                  transition: "opacity 0.3s",
                                  "&:hover": {
                                    backgroundColor:
                                      appTheme.palette.primary.dark,
                                  },
                                }}
                                className="camera-icon"
                              >
                                <CameraAltIcon />
                              </IconButton>
                            </label>
                            <Avatar
                              alt="Profile"
                              src={
                                user.image
                                  ? `http://localhost:8080/users/uploads/${user.image}`
                                  : "/default-avatar.jpg"
                              }
                            />
                          </Box>
                        </Zoom>

                        
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <CheckIcon />
                )
              }
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={Slide}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default UserProfile;
