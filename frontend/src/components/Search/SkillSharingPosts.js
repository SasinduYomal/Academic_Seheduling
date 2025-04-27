// src/components/SkillSharingPosts.js
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
} from "@mui/material";

function SkillSharingPosts() {
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState("");

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 3); // Limit to 3
        setFiles(selectedFiles);
    };
}
    