import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../contexts/useSnackbar";
import { login } from "../services/authService";
import {
  Box,
  TextField,
  Button,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import flugoLogo from "../assets/flugo-logo.webp";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      showSnackbar("Login realizado com sucesso!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      showSnackbar("Usuário ou senha inválidos.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[100],
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: { xs: "90%", sm: 400 },
        }}
      >
        <Box
          component="img"
          src={flugoLogo}
          alt="Logo Flugo"
          sx={{
            width: "auto",
            maxHeight: "100px",
            marginBottom: 2,
          }}
        />

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            mt: 1,
            width: "100%",
          }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            autoFocus
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Box sx={{ position: "relative", mt: 3, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              Entrar
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: "primary.main",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
