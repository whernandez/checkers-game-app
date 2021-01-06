import React from "react";
import { Button, ButtonGroup, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// My Components and utils
import { constants, Components } from "core";

const {
  Labels: { NextPlayLabel },
} = Components;

const BoardHeader = ({ onAllAvailablePieceMovesByColor, nextPlay }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <ButtonGroup
          variant="text"
          color="primary"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={() =>
              onAllAvailablePieceMovesByColor(constants.MAIN_PIECE_COLOR)
            }
            className={classes.button}
          >
            See All Possible {constants.MAIN_PIECE_COLOR} Piece Moves
          </Button>
          <Button
            onClick={() =>
              onAllAvailablePieceMovesByColor(constants.SECONDARY_PIECE_COLOR)
            }
            className={classes.button}
          >
            See All Possible {constants.SECONDARY_PIECE_COLOR} Piece Moves
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={2}>
        <NextPlayLabel playerColor={nextPlay} />
      </Grid>
    </Grid>
  );
};

// Component style
const useStyles = makeStyles({
  button: {
    right: "30%",
  },
  nextPlay: {
    left: "17%",
  },
});

export default BoardHeader;
