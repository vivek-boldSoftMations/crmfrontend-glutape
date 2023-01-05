import { Container, Box, Grid, Button } from "@mui/material";
import React, { useState } from "react";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import PersonIcon from "@mui/icons-material/Person";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
export const Auths = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <Container className="Auth-form-container" component="main" maxWidth="xs">
        <Box className="Auth-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end">
  
              <Button
                startIcon={<PersonIcon />}
                variant={showLogin === true ? "contained" : "outlined"}
                onClick={() => setShowLogin(true)}
                sx={showLogin === true && {backgroundColor:"#006ba1"}}
              >
                Sign In
              </Button>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              justifyContent="flex-start"
            >
        
              <Button
                startIcon={<GroupAddIcon />}
                variant={showLogin === false ? "contained" : "outlined"}
                onClick={() => setShowLogin(false)}
                sx={ showLogin === false && {backgroundColor:"#006ba1"}}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
          {showLogin === true ? (
            <Login />
          ) : (
            <SignUp setShowLogin={setShowLogin} />
          )}
        </Box>
      </Container>
    </>
  );
};
