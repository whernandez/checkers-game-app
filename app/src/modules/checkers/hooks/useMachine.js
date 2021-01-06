import React, { useContext } from "react";
import { utils, constants, Context } from "core";
import { useJumps } from "./index";

const useMachine = () => {
  const { board } = useContext(Context.CheckersContext);
  const {
    getPieceJumpsLeftDirection,
    getPieceJumpsRightDirection,
  } = useJumps();

  /**
   * Make machine play
   * @returns {Promise<{positionToMove: *, pieceToPlay: *}>}
   */
  const playMachine = async () => {
    try {
      const availablePieces = utils.getRandomPieceToMoveByColor(
        board,
        constants.MAIN_PIECE_COLOR
      );
      let pieceToPlay =
        availablePieces[Math.floor(Math.random() * availablePieces.length)];

      if (pieceToPlay) {
        let possibleJumps = [];
        let possibleMoves = [];

        const pieceMoveToRight = utils.getPieceMovingRightDirection(
          board,
          pieceToPlay
        );
        const pieceMoveToLeft = utils.getPieceMovingLeftDirection(
          board,
          pieceToPlay
        );

        if (pieceMoveToRight) {
          possibleMoves.push(pieceMoveToRight);
        }
        if (pieceMoveToLeft) {
          possibleMoves.push(pieceMoveToLeft);
        }
        let positionToMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        if (pieceToPlay.isKing) {
          possibleJumps = utils.findAllPossibleMovesByKing(
            board,
            pieceToPlay.index,
            pieceToPlay.index,
            pieceToPlay.index,
            pieceToPlay.index
          );
        } else {
          const pieceJumpsToRight = getPieceJumpsRightDirection(pieceToPlay);
          const pieceJumpsToLeft = getPieceJumpsLeftDirection(pieceToPlay);

          possibleJumps = pieceJumpsToLeft.concat(pieceJumpsToRight);
        }

        if (possibleJumps.length > 0) {
          positionToMove =
            possibleJumps[Math.floor(Math.random() * possibleJumps.length)];
        }

        positionToMove.color = pieceToPlay.color;

        return await Promise.resolve({ positionToMove, pieceToPlay });
      }
    } catch (e) {
      // console.log(e);
      return await Promise.reject(e);
    }
  };

  return [playMachine];
};

export default useMachine;
