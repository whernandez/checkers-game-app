import React, { useContext, useEffect, useState } from "react";
import _lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@material-ui/core";
// My Components
import DrawBoard from "./DrawBoard";
import DrawEmptyBoard from "./DrawEmptyBoard";
import PiecesCount from "./PiecesCount";
import BoardHeader from "./BoardHeader";
// Utils and Components
import { Components, constants, Context, getBoardData, utils } from "core";
import ActionButtonsBoard from "./ActionButtonsBoard";
// Hooks
import {
  useJumps,
  useMachine,
  useSavePiece,
  useToggleMenuPiece,
} from "../hooks";

const {
  Labels: { Title },
  Alert: { useAlert },
} = Components;

const Checkers = () => {
  const classes = useStyles();

  // get board data from context api
  const { board, refreshBoard } = useContext(Context.CheckersContext);

  // Save Piece
  const [savePiece] = useSavePiece();
  // Toggle Piece
  const [toggleMenuPiece] = useToggleMenuPiece();
  // Manage Machine
  const [playMachine] = useMachine();
  // Manage Jumps
  const {
    getAvailableJumps,
    removeJumpedPiece,
    getPieceJumpsLeftDirection,
    getPieceJumpsRightDirection,
  } = useJumps();

  const [playAgainstMachine, setPlayAgainstMachine] = useState(false);
  const [nextPlay, setNextPlay] = useState(constants.SECONDARY_PIECE_COLOR);
  const [availableMoves, setAvailableMoves] = useState([]);
  const [startedGame, setStartedGame] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [Alert, showAlert] = useAlert(false);

  // Handle when machine is playing
  useEffect(() => {
    if (nextPlay === constants.MAIN_PIECE_COLOR && playAgainstMachine) {
      handleMachinePlay();
    }
  }, [nextPlay]);

  /**
   * Stop or start the game
   */
  const handleStartedGame = () => {
    setPlayAgainstMachine(false);
    setAvailableMoves([]);
    setSelectedPiece(null);

    refreshBoard(getBoardData());
    toggleStartedGame();
  };

  /**
   * Set App to play versus machine
   */
  const handlePlayAgainstMachine = () => {
    setPlayAgainstMachine(true);
    setNextPlay(constants.SECONDARY_PIECE_COLOR);
    setAvailableMoves([]);
    setSelectedPiece(null);
    refreshBoard([...getBoardData()]);
    toggleStartedGame();
  };

  /**
   * Play with machine
   */
  const handleMachinePlay = () => {
    if (nextPlay === constants.MAIN_PIECE_COLOR) {
      playMachine()
        .then((resp) => {
          // Set a pause to not to affect the user experience
          setTimeout(() => {
            if (resp.positionToMove) {
              onPlay(resp.positionToMove, resp.pieceToPlay);
            }
          }, 2000);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  /**
   * Set start game true or false to hide/show some data in the board
   */
  const toggleStartedGame = () => {
    setStartedGame(!startedGame);
  };

  /**
   * Get all possible moves and jumps for a piece
   * @param piece
   */
  const onPressPiece = (piece) => {
    try {
      setSelectedPiece(piece);

      // Get moves and jumps
      const moves = piece.isKing
        ? utils.findAllPossibleMovesByKing(
            board,
            piece.index,
            piece.index,
            piece.index,
            piece.index
          )
        : getAvailableMoving(piece);
      const pieceJumpsToRight = getPieceJumpsRightDirection(piece);
      const pieceJumpsToLeft = getPieceJumpsLeftDirection(piece);

      // Merge moves with jumps
      const movesAndJumps = pieceJumpsToLeft.concat(pieceJumpsToRight, moves);
      if (movesAndJumps.length > 0) {
        const availableMovesCopy = _lodash.cloneDeep(availableMoves);
        setAvailableMoves([availableMovesCopy, ...movesAndJumps]);
      }
    } catch (e) {
      // Prevent app crashed
      // console.log(e);
    }
  };

  /**
   * Start a play
   * @param positionToMove
   * @param pieceToMove
   */
  const onPlay = (positionToMove, pieceToMove = selectedPiece) => {
    try {
      if (nextPlay !== pieceToMove.color) {
        showAlert(`The next move must be ${nextPlay}`);
        return;
      }
      if (!positionToMove) {
        showAlert("You must select the position you want to move.");
        return;
      }
      if (!pieceToMove) {
        showAlert("You must select the piece you want to move.");
        return;
      }
      // Unavailable new position
      positionToMove.isAvailable = false;
      positionToMove.color = pieceToMove.color;
      positionToMove.isKing = pieceToMove.isKing
        ? true
        : utils.mustPieceBecomeKing(board, positionToMove);

      savePiecePosition(positionToMove);

      // Remove Jumped pieces
      removeJumpedPieces(pieceToMove, positionToMove);

      // Available current position
      pieceToMove.isAvailable = true;
      savePiecePosition(pieceToMove);

      // Reset available positions
      setAvailableMoves([]);
      setSelectedPiece(null);

      // Set next play
      if (nextPlay === constants.SECONDARY_PIECE_COLOR) {
        setNextPlay(constants.MAIN_PIECE_COLOR);
      } else {
        setNextPlay(constants.SECONDARY_PIECE_COLOR);
      }
    } catch (e) {
      showAlert("An unexpected error occurred while processing the move.");
      console.log(e);
    }
  };

  /**
   * Check available moves
   * @param piece
   */
  const getAvailableMoving = (piece) => {
    const pieceMoveToRight = utils.getPieceMovingRightDirection(board, piece);
    const pieceMoveToLeft = utils.getPieceMovingLeftDirection(board, piece);

    let availableClone = [];
    setAvailableMoves(availableClone);

    if (
      pieceMoveToRight &&
      pieceMoveToRight.isAvailable &&
      !pieceMoveToRight.isLocked
    ) {
      availableClone.push(pieceMoveToRight);
    }
    if (
      pieceMoveToLeft &&
      pieceMoveToLeft.isAvailable &&
      !pieceMoveToLeft.isLocked
    ) {
      availableClone.push(pieceMoveToLeft);
    }

    return availableClone;
  };

  /**
   * Get possible jumps
   * @param piece
   */
  const handleAvailableJumps = (piece) => {
    const availableMovesCopy = _lodash.cloneDeep(availableMoves);
    getAvailableJumps(piece)
      .then((jumps) => {
        setAvailableMoves([availableMovesCopy, ...jumps]);
      })
      .catch((e) => {
        // console.log(e);
      });
  };

  /**
   * Save piece position
   * @param piece
   */
  const savePiecePosition = (piece) => {
    savePiece(piece)
      .then((data) => {
        // Refresh state
        refreshBoard([...data]);
        checkGameOver();
      })
      .catch((e) => {
        console.log(e);
        // console.log(e, "catch");
      });
  };

  // Confirm if game finished
  const checkGameOver = () => {
    const mainCount = utils.getAvailablePiecesToPlayByColor(
      board,
      constants.MAIN_PIECE_COLOR
    ).length;
    const secondaryCount = utils.getAvailablePiecesToPlayByColor(
      board,
      constants.SECONDARY_PIECE_COLOR
    ).length;
    if (mainCount === 0) {
      showAlert(`Game Over. | ${constants.SECONDARY_PIECE_COLOR} Win!`);
    }
    if (secondaryCount === 0) {
      showAlert(`Game Over. | ${constants.MAIN_PIECE_COLOR} Win!`);
    }
  };

  /**
   * Show / Hide menu options
   * @param piece
   */
  const toggleMenu = (piece) => {
    toggleMenuPiece(piece)
      .then()
      .catch((e) => {
        // console.log(e);
      });
  };

  /**
   * Take option from menu
   * @param option
   * @param dataOption
   * @param piece
   */
  const onChooseOption = (option, dataOption, piece) => {
    setSelectedPiece(piece);
    switch (option) {
      case constants.SHOW_POSSIBLE_MOVES:
        showPossibleMoves(piece);
        return;
      case constants.SHOW_POSSIBLE_JUMPS:
        handleAvailableJumps(piece);
        return;
      case constants.SHOW_POSSIBLE_WHITE_PIECES_MOVES:
        handleAllAvailablePieceMovesByColor(dataOption);
        return;
      case constants.SHOW_POSSIBLE_RED_PIECES_MOVES:
        handleAllAvailablePieceMovesByColor(dataOption);
        return;
      default:
        return;
    }
  };

  /**
   * Show all possible move positions for a piece
   * @param piece
   */
  const showPossibleMoves = (piece) => {
    const moves = piece.isKing
      ? utils.findAllPossibleMovesByKing(
          board,
          piece.index,
          piece.index,
          piece.index,
          piece.index
        )
      : getAvailableMoving(piece);
    if (moves.length > 0) {
      setAvailableMoves([availableMoves, ...moves]);
    }
  };

  /**
   * Unavailable jumped pieces
   * @param selectedPiece
   * @param positionToMove
   */
  const removeJumpedPieces = (selectedPiece, positionToMove) => {
    removeJumpedPiece(selectedPiece, positionToMove)
      .then((resp) => {
        // console.log(resp);
      })
      .catch((e) => {
        // console.log(e);
      });
  };

  /**
   * Show all possible moves to a specific color
   * @param color
   * @returns {*}
   */
  const handleAllAvailablePieceMovesByColor = (color) => {
    const moves = utils.getAllAvailablePieceMovesByColor(board, color);
    const availableMovesClone = _lodash.cloneDeep(availableMoves);
    setAvailableMoves([availableMovesClone, ...moves]);
  };

  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            startedGame ? (
              <Avatar aria-label="recipe" className={classes.avatar}>
                WH
              </Avatar>
            ) : null
          }
          action={
            <ActionButtonsBoard
              hasGameStarted={startedGame}
              onPlayAgainstMachine={handlePlayAgainstMachine}
              onStartedGame={handleStartedGame}
            />
          }
          title={
            startedGame ? (
              <Title title={"Checkers Game by Wandy Hernandez"} size={"h6"} />
            ) : null
          }
          subheader={startedGame ? utils.getDateNow() : ""}
        />
        <CardContent className={classes.content}>
          {startedGame ? (
            <React.Fragment>
              <BoardHeader
                nextPlay={nextPlay}
                onAllAvailablePieceMovesByColor={
                  handleAllAvailablePieceMovesByColor
                }
              />
              <DrawBoard
                board={board}
                onPressPiece={onPressPiece}
                toggleMenu={toggleMenu}
                onChooseOption={onChooseOption}
                availableMoves={availableMoves}
                onPlay={onPlay}
              />
            </React.Fragment>
          ) : (
            <DrawEmptyBoard />
          )}
        </CardContent>
        <CardActions>{startedGame ? <PiecesCount /> : null}</CardActions>
      </Card>
      <Alert />
    </React.Fragment>
  );
};

// Component style
const useStyles = makeStyles({
  root: {
    backgroundColor: "#fff",
    padding: 0,
  },
  content: {
    padding: 0,
    paddingTop: 24,
  },
  avatar: {
    backgroundColor: "red[500]",
  },
});

export default Checkers;
