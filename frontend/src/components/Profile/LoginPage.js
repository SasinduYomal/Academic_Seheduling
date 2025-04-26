import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Fade,
  Slide,
  Link,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  CameraAltOutlined,
  Visibility,
  VisibilityOff,
  Fingerprint,
  Google,
  GitHub,
} from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import { keyframes, styled } from "@mui/system";

// Gradient background animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Floating animation for the camera icon
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

// Pulse animation for the submit button
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(30, 144, 255, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(30, 144, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 144, 255, 0); }
`;

// Custom styled button with gradient
const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #1E90FF 0%, #00BFFF 100%)",
  color: "white",
  fontWeight: "bold",
  padding: "12px 24px",
  borderRadius: "50px",
  boxShadow: "0 4px 15px rgba(30, 144, 255, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(30, 144, 255, 0.6)",
    background: "linear-gradient(45deg, #1E90FF 30%, #00BFFF 90%)",
  },
}));

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        credentials,
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/UserProfile");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  // New helper function for OAuth login
  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg, #0a192f, #172a45, #1e3a8a, #1e90ff)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 12s ease infinite`,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          zIndex: 0,
        },
      }}
    >
      {/* Animated floating bubbles */}
      {Array.from({ length: 10 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            animation: `${floatAnimation} ${
              15 + Math.random() * 15
            }s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${10 + Math.random() * 30}px`,
            height: `${10 + Math.random() * 30}px`,
            zIndex: 0,
          }}
        />
      ))}

      

              <GradientButton
                type="submit"
                fullWidth
                sx={{
                  mt: 2,
                  mb: 3,
                  fontSize: "1.1rem",
                  animation: `${pulseAnimation} 3s infinite`,
                }}
              >
                Login
              </GradientButton>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Link
                  href="/forgot-password"
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#1E90FF",
                      textDecoration: "none",
                    },
                  }}
                >
                  Forgot password?
                </Link>
                <Link
                  href="/RegisterPage"
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#1E90FF",
                      textDecoration: "none",
                    },
                  }}
                >
                  Don't have an account? <strong>Sign Up</strong>
                </Link>
              </Box>

              <Divider sx={{ my: 4, color: "rgba(255, 255, 255, 0.3)" }}>
                OR CONTINUE WITH
              </Divider>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 3,
                }}
              >
                <IconButton
                  onClick={() => handleOAuthLogin("google")}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Google sx={{ color: "#DB4437" }} />
                </IconButton>
                <IconButton
                  onClick={() => handleOAuthLogin("github")}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  <GitHub sx={{ color: "#ffffff" }} />
                </IconButton>
                <IconButton
                  onClick={() => handleOAuthLogin("facebook")}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  <FacebookIcon sx={{ color: "#1877F2" }} />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Slide>
    </Box>
  );
}

export default Login;
