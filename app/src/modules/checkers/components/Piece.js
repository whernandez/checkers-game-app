import React from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core";
import { constants } from "../../../core";

const Piece = ({ piece, onClick }) => {
  const classes = useStyles();
  return (
    <span
      onClick={() => onClick(piece)}
      className={classnames(
        classes.root,
        piece.color === constants.SECONDARY_PIECE_COLOR
          ? classes.red
          : classes.white
      )}
    >
      {piece.isKing ? "K" : ""}
    </span>
  );
};

// Component style
const useStyles = makeStyles({
  root: {
    cursor: "pointer",
    color: "black",
    fontWeight: "bolder",
    fontSize: "48px",
    display: "inline-block",
    height: "75px",
    borderRadius: "100%",
    width: "75px",
    border: "solid #595959 2px",
  },
  red: {
    backgroundColor: "#ce5858",
  },
  white: {
    backgroundColor: "#f6f6f6",
  },
  icon: {
    marginBottom: 5,
  },
});

export default Piece;
