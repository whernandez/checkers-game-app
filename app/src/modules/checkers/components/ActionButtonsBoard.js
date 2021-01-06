import React from "react";
import { Button } from "@material-ui/core";

const ActionButtonsBoard = ({
  hasGameStarted,
  onStartedGame,
  onPlayAgainstMachine,
}) => {
  return (
    <React.Fragment>
      <Button
        variant="contained"
        color={hasGameStarted ? "secondary" : "primary"}
        onClick={onStartedGame}
      >
        {` ${hasGameStarted ? "Reset" : "Start"} Game`}{" "}
      </Button>{" "}
      {!hasGameStarted ? (
        <Button
          variant="contained"
          color={hasGameStarted ? "secondary" : "primary"}
          onClick={onPlayAgainstMachine}
        >
          Play vs Machine
        </Button>
      ) : null}
    </React.Fragment>
  );
};

export default ActionButtonsBoard;
