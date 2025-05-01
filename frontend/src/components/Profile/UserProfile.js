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

    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    loadUserData();
  }, [navigate]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userDetails", JSON.stringify(updatedUser));

      if (selectedImage) {
        formData.append("file", selectedImage);
      }

      const response = await axios.put(
        `http://localhost:8080/users/${user.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(response.data);
      setUpdatedUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenEditDialog(false);
      setSelectedImage(null);
      showSnackbar("Profile updated successfully", "success");
    } catch (error) {
      showSnackbar("Error updating profile", "error");
    } finally {
      setLoading(false);
    }
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

  const handlePostUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `http://localhost:8080/users/${user.id}/posts/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      showSnackbar("Post uploaded successfully", "success");
    } catch (error) {
      showSnackbar("Error uploading post", "error");
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

            {user && !loading && (
              <Grow in={true} timeout={1000}>
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} md={5} lg={4}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background: appTheme.palette.background.paper,
                      }}
                    >
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

                        <Typography variant="h5" gutterBottom>
                          {user.username}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          color="text.secondary"
                          mb={2}
                        >
                          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            {user.email}
                          </Typography>
                        </Box>

                        {/* Followers/Following */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                          gap={2}
                          mb={3}
                        >
                          <Card
                            sx={{
                              flex: 1,
                              textAlign: "center",
                              backgroundColor:
                                appTheme.palette.background.default,
                            }}
                          >
                            <CardContent>
                              <Typography
                                variant="h6"
                                color="primary"
                                fontWeight="bold"
                              >
                                {followersCount}
                              </Typography>
                              <Typography variant="body2">Followers</Typography>
                            </CardContent>
                          </Card>
                          <Card
                            sx={{
                              flex: 1,
                              textAlign: "center",
                              backgroundColor:
                                appTheme.palette.background.default,
                            }}
                          >
                            <CardContent>
                              <Typography
                                variant="h6"
                                color="primary"
                                fontWeight="bold"
                              >
                                {followingCount}
                              </Typography>
                              <Typography variant="body2">Following</Typography>
                            </CardContent>
                          </Card>
                        </Box>

                        {/* Action Buttons */}
                        <Box width="100%" mb={3}>
                          <Button
                            variant="contained"
                            color={isFollowing ? "secondary" : "primary"}
                            onClick={handleFollowToggle}
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={loading}
                            startIcon={
                              isFollowing ? (
                                <CloseIcon />
                              ) : (
                                <FavoriteBorderIcon />
                              )
                            }
                          >
                            {isFollowing ? "Unfollow" : "Follow"}
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => setOpenEditDialog(true)}
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={loading}
                          >
                            Edit Profile
                          </Button>
                        </Box>

                        {/* Post Upload */}
                        <Slide direction="up" in={true} timeout={1500}>
                          <Box width="100%">
                            <label htmlFor="post-upload">
                              <input
                                id="post-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handlePostUpload}
                              />
                              <Button
                                component="span"
                                variant="contained"
                                color="secondary"
                                fullWidth
                                startIcon={<AddIcon />}
                                disabled={loading}
                              >
                                Upload Post
                              </Button>
                            </label>
                          </Box>
                        </Slide>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={7} lg={6}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        height: "100%",
                        background: appTheme.palette.background.paper,
                      }}
                    >
                      {/* About Section */}
                      <Box sx={{ width: "100%" }}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          onClick={() => setShowAbout(!showAbout)}
                          sx={{
                            cursor: "pointer",
                            mb: 1,
                            "&:hover": {
                              backgroundColor: appTheme.palette.action.hover,
                              borderRadius: 1,
                            },
                          }}
                        >
                          <Typography variant="h6" sx={{ p: 1 }}>
                            About Me
                          </Typography>
                          <IconButton>
                            <ExpandMoreIcon
                              sx={{
                                transform: showAbout
                                  ? "rotate(180deg)"
                                  : "rotate(0)",
                                transition: "transform 0.3s",
                                color: appTheme.palette.primary.main,
                              }}
                            />
                          </IconButton>
                        </Box>
                        <Collapse in={showAbout}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            mt={1}
                            p={2}
                            sx={{
                              backgroundColor:
                                appTheme.palette.background.default,
                              borderRadius: 2,
                            }}
                          >
                            <Box display="flex" alignItems="center">
                              <PersonIcon color="primary" sx={{ mr: 2 }} />
                              <Typography variant="body1">
                                <strong>Username:</strong> {user.username}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <EmailIcon color="primary" sx={{ mr: 2 }} />
                              <Typography variant="body1">
                                <strong>Email:</strong> {user.email}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <PhoneIcon color="primary" sx={{ mr: 2 }} />
                              <Typography variant="body1">
                                <strong>Mobile:</strong>{" "}
                                {user.mobile || "Not provided"}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <CakeIcon color="primary" sx={{ mr: 2 }} />
                              <Typography variant="body1">
                                <strong>Date of Birth:</strong>{" "}
                                {formatDate(user.dateOfBirth)}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="flex-start">
                              <DescriptionIcon
                                color="primary"
                                sx={{ mr: 2, mt: 0.5 }}
                              />
                              <Typography variant="body1">
                                <strong>Description:</strong>{" "}
                                {user.description || "No description available"}
                              </Typography>
                            </Box>
                          </Box>
                        </Collapse>
                      </Box>

                      {/* Additional Info */}
                      <Box mt={4}>
                        <Typography variant="h6" gutterBottom>
                          Account Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 3,
                          }}
                        >
                          <Chip
                            label={`Joined: ${formatDate(user.createdAt)}`}
                            color="primary"
                            variant="outlined"
                            icon={<CheckIcon />}
                          />
                          <Chip
                            label={
                              user.lastLogin
                                ? `Last login: ${formatDate(user.lastLogin)}`
                                : "Never logged in"
                            }
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      {/* Danger Zone */}
                      <Box mt={4}>
                        <Typography variant="h6" gutterBottom color="error">
                          Danger Zone
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={handleDelete}
                          fullWidth
                          disabled={loading}
                          sx={{
                            "&:hover": {
                              backgroundColor: appTheme.palette.error.dark,
                            },
                          }}
                        >
                          Delete Account
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grow>
            )}
          </Container>
        </Box>

        {/* Edit Profile Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Slide}
          transitionDuration={500}
        >
          <DialogTitle
            sx={{
              backgroundColor: appTheme.palette.primary.main,
              color: "white",
            }}
          >
            Edit Profile
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Username"
                fullWidth
                value={updatedUser.username || ""}
                name="username"
                onChange={handleChange}
                sx={{ mb: 2 }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PersonIcon
                      color="primary"
                      sx={{ mr: 1, color: "action.active" }}
                    />
                  ),
                }}
              />
              <TextField
                label="Email"
                fullWidth
                value={updatedUser.email || ""}
                name="email"
                onChange={handleChange}
                sx={{ mb: 2 }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <EmailIcon
                      color="primary"
                      sx={{ mr: 1, color: "action.active" }}
                    />
                  ),
                }}
              />
              <TextField
                label="Mobile"
                fullWidth
                value={updatedUser.mobile || ""}
                name="mobile"
                onChange={handleChange}
                sx={{ mb: 2 }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PhoneIcon
                      color="primary"
                      sx={{ mr: 1, color: "action.active" }}
                    />
                  ),
                }}
              />
              <TextField
                label="Date of Birth"
                fullWidth
                type="date"
                value={updatedUser.dateOfBirth || ""}
                name="dateOfBirth"
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <CakeIcon
                      color="primary"
                      sx={{ mr: 1, color: "action.active" }}
                    />
                  ),
                }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={updatedUser.description || ""}
                name="description"
                onChange={handleChange}
                sx={{ mb: 2 }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <DescriptionIcon
                      color="primary"
                      sx={{ mr: 1, mt: 0.5, color: "action.active" }}
                    />
                  ),
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CameraAltIcon />}
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </Button>
                {selectedImage && (
                  <Typography variant="body2">{selectedImage.name}</Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setOpenEditDialog(false)}
              disabled={loading}
              variant="outlined"
            >
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
