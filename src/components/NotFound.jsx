import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useAuth } from "../utils/context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          py: 8,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", md: "8rem" },
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
            maxWidth: "500px",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
          <br />
          <Typography
            component="span"
            sx={{
              fontFamily: "monospace",
              color: "error.main",
              fontSize: "0.9rem",
              mt: 1,
              display: "block",
            }}
          >
            {location.pathname}
          </Typography>
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;

