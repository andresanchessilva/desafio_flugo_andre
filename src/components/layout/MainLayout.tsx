import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  CssBaseline,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
const drawerWidth = "280px";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Logo from "../../assets/flugo-logo.webp";
import { navigationRoutes } from "../../config/navigation";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px dashed #EAECEE",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar disableGutters sx={{ pl: 1 }}>
          <Box
            component="img"
            src={Logo}
            alt="Flugo logo"
            sx={{ height: 40, width: "auto" }}
          />
        </Toolbar>
        <List>
          {navigationRoutes.map((route, index) => (
            <ListItem
              key={index}
              disablePadding
              component={Link}
              to={route.path}
            >
              <ListItemButton
                LinkComponent={Link}
                sx={{
                  margin: "0 8px",
                  borderRadius: "8px",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    marginRight: "8px",
                  }}
                >
                  {route.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        fontWeight={500}
                      >
                        {route.name}
                      </Typography>
                      <Box
                        component="span"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <KeyboardArrowRightIcon
                          fontSize="small"
                          sx={{
                            color: (theme) => theme.palette.text.secondary,
                          }}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#fff",
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Box
          height="64px"
          paddingX={4}
          alignItems="center"
          display="flex"
          justifyContent="flex-end"
        >
          <Avatar
            src={`https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=flugo`}
          />
        </Box>
        <Box
          component="main"
          sx={{
            backgroundColor: "#fff",
            p: 5,
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
