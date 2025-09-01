import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ptBR as ptBRDataGrid } from "@mui/x-data-grid/locales";
import { ptBR as ptBRCore } from "@mui/material/locale";
import SnackbarProvider from "./contexts/SnackbarProvider";

const theme = createTheme(
  {
    typography: {
      button: {
        textTransform: "none",
        fontWeight: "bold",
      },
    },
    palette: {
      mode: "light",
      primary: {
        main: "#22C55F",
        contrastText: "#ffffff",
      },
      text: {
        primary: "#212B36",
        secondary: "#637481",
      },
      success: {
        main: "#22C55F",
        contrastText: "#ffffff",
      },
      error: {
        main: "#ff1616ff",
        contrastText: "#ffffff",
      },

      successChip: {
        main: "#138D57",
        background: "#DCF6E5",
      },
      errorChip: {
        main: "#B71D19",
        background: "#FFE4DE",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "& .MuiTouchRipple-root span": {
              backgroundColor: "#22C55F",
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          filledSuccess: ({ theme }) => ({
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            fontWeight: "bold",
          }),

          filledError: ({ theme }) => ({
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            fontWeight: "bold",
          }),
        },
      },
    },
  },
  ptBRCore,
  ptBRDataGrid
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
