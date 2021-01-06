import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { pink } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";

import { utils, constants, Context } from "core";

const PiecesCount = () => {
  const classes = useStyles();
  // get board data from context api
  const { board } = useContext(Context.CheckersContext);

  return (
    <div className={classes.root}>
      <Avatar>
        {
          utils.getAvailablePiecesToPlayByColor(
            board,
            constants.MAIN_PIECE_COLOR
          ).length
        }
      </Avatar>
      <Avatar className={classes.pink}>
        {
          utils.getAvailablePiecesToPlayByColor(
            board,
            constants.SECONDARY_PIECE_COLOR
          ).length
        }
      </Avatar>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
}));

export default PiecesCount;
