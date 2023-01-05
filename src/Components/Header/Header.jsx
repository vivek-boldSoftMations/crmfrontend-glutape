import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";

import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  CssBaseline,
  Divider,
  Drawer
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { logoutUser } from "../../Redux/Action/Action";
import "./Header.css";
import { ListItems } from './ListItems';

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const Header = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isHoverLogout, setIsHoverLogout] = useState(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
  };

  return (
    <div>
      <CssBaseline />
      {/* sidebar */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          component="nav"
          style={{ width: "100%", marginBottom: "2em" }}
          disablePadding
        >
         <ListItems />
        </List>
      </Drawer>
      {/* Header */}
      <AppBar position="fixed" sx={{backgroundColor:"#006ba1"}} className="not-scrolled">
        <Toolbar>
          {auth.user && (
            <IconButton
              edge="start"
              style={{
                fontFamily: "Open Sans; sans-serif",
                fontWeight: "700px",
                size: "18px",
                marginLeft: "38px",
              }}
              color="inherit"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" style={{ marginRight: "auto" }}>
            Bold-SoftMation
          </Typography>
          <>
            {/* {!auth.user ? (
              <>
                <Button
                  {...{
                    color: "inherit",
                    to: "/login",
                    component: RouterLink,
                  }}
                  style={
                    isHoverLogin === true
                      ? {
                          backgroundColor: isHoverLogin
                            ? "rgb(0, 191, 255)"
                            : "rgb(0, 191, 255)",
                          fontFamily: "Open Sans; sans-serif",
                          fontWeight: "bolder",
                          size: "18px",
                        }
                      : null
                  }
                  onMouseEnter={() => setIsHoverLogin(true)}
                  onMouseLeave={() => setIsHoverLogin(false)}
                >
                  Login
                </Button>
                <Button
                  {...{
                    color: "inherit",
                    to: "/signup",
                    component: RouterLink,
                  }}
                  style={
                    isHoverSignup === true
                      ? {
                          backgroundColor: isHoverSignup
                            ? "rgb(0, 191, 255)"
                            : "rgb(0, 191, 255)",
                          fontFamily: "Open Sans; sans-serif",
                          fontWeight: "bolder",
                          size: "18px",
                        }
                      : null
                  }
                  className="menuButton"
                  onMouseEnter={() => setIsHoverSignup(true)}
                  onMouseLeave={() => setIsHoverSignup(false)}
                >
                  Signup
                </Button>
              </>
            ) : ( */}
            {auth.user && 
              <Button
                {...{
                  color: "inherit",
                  to: "/",
                  component: RouterLink,
                }}
                style={
                  isHoverLogout === true
                    ? {
                        backgroundColor: isHoverLogout
                          ? "rgb(0, 191, 255)"
                          : "rgb(0, 191, 255)",
                        fontFamily: "Open Sans; sans-serif",
                        fontWeight: "bolder",
                        size: "18px",
                      }
                    : null
                }
                onMouseEnter={() => setIsHoverLogout(true)}
                onMouseLeave={() => setIsHoverLogout(false)}
                onClick={logout}
              >
                Logout
              </Button>
}
            {/* )} */}
          </>
        </Toolbar>
      </AppBar>
    </div>
  );
};
