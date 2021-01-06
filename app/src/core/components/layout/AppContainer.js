import React from "react";
import { Typography, CssBaseline, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const AppContainer = ({ children }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <Typography component="div" className={classes.content}>
          {children}
        </Typography>
      </Container>
    </React.Fragment>
  );
};

// Component style
const useStyles = makeStyles({
  content: {
    minWidth: 275,
    padding: 50,
    backgroundColor: "#cfe8fc",
  },
});

export default AppContainer;
