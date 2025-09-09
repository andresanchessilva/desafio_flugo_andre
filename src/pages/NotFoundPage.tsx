import { Box, Typography, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
        backgroundColor: theme.palette.primary.light + "20",
        padding: theme.spacing(3),
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: "bold",
          mb: 2,
          color: theme.palette.primary.main,
          fontSize: "6rem",
          [theme.breakpoints.down("sm")]: {
            fontSize: "4rem",
          },
        }}
      >
        404
      </Typography>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: theme.palette.text.secondary,
          [theme.breakpoints.down("sm")]: {
            fontSize: "1.5rem",
          },
        }}
      >
        Oops! Página não encontrada.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Voltar para a Home
      </Button>
    </Box>
  );
}
