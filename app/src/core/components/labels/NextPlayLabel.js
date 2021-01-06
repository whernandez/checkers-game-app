import React from "react";
import { ChipLabel } from "../labels";
import * as constants from "../../constants";
import { makeStyles } from "@material-ui/core";

const NextPlayLabel = ({ playerColor }) => {
  const classes = useStyles();

  return (
    <ChipLabel
      className={classes.root}
      size={"small"}
      text={`On Play: ${playerColor}`}
      color={
        playerColor === constants.MAIN_PIECE_COLOR ? "default" : "secondary"
      }
    />
  );
};

// Component style
const useStyles = makeStyles({
  root: {
    left: "15%",
  },
});

export default NextPlayLabel;
