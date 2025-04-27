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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  CameraAltOutlined,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Cake,
  Transgender,
} from "@mui/icons-material";
import { keyframes, styled } from "@mui/system";

/
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VisibilityOff sx={{ color: "#1E90FF" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(30, 144, 255, 0.5)",
                      borderRadius: "12px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1E90FF",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1E90FF",
                      boxShadow: "0 0 0 2px rgba(30, 144, 255, 0.2)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "#1E90FF",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                    py: 1.5,
                  },
                }}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiOutlinedInput-root": {
       
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Slide>
    </Box>
  );
}

export default Register;
