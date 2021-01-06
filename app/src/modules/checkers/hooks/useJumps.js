import React, { useContext } from "react";
import { utils, constants, Context } from "core";
import useSavePiece from "./useSavePiece";
import _lodash from "lodash";

const useJumps = () => {
  const { board, refreshBoard } = useContext(Context.CheckersContext);
  const [savePiece] = useSavePiece();

  /**
   * Return the possible jumps in right direction for piece
   * @param piece
   * @returns {*}
   */
  const getPieceJumpsRightDirection = (piece) => {
    const positions = utils.findAllPositionsByDiagonalDirection(
      board,
      piece.color,
      piece.index,
      constants.RIGHT_DIAGONAL_DIRECTION
    );
    return utils.findAllPossibleJumpPositions(
      positions,
      piece,
      piece.color,
      constants.RIGHT_DIAGONAL_DIRECTION
    );
  };

  /**
   * Return the possible jumps in left direction for piece
   * @param piece
   * @returns {*}
   */
  const getPieceJumpsLeftDirection = (piece) => {
    const positions = utils.findAllPositionsByDiagonalDirection(
      board,
      piece.color,
      piece.index,
      constants.LEFT_DIAGONAL_DIRECTION
    );
    return utils.findAllPossibleJumpPositions(
      positions,
      piece,
      piece.color,
      constants.LEFT_DIAGONAL_DIRECTION
    );
  };

  /**
   * Get possible jumps
   * @param piece
   */
  const getAvailableJumps = async (piece) => {
    try {
      let jumps = [];

      if (piece.isKing) {
        jumps = utils.findAllPossibleMovesByKing(
          board,
          piece.index,
          piece.index,
          piece.index,
          piece.index
        );
      } else {
        const pieceJumpsToRight = getPieceJumpsRightDirection(piece);

        const pieceJumpsToLeft = getPieceJumpsLeftDirection(piece);
        jumps = pieceJumpsToLeft.concat(pieceJumpsToRight);
      }

      return await Promise.resolve(jumps);
    } catch (e) {
      return await Promise.reject(e);
      // console.log(e);
    }
  };

  /**
   * Unavailable jumped pieces
   * @param selectedPiece
   * @param positionToMove
   */
  const removeJumpedPiece = async (selectedPiece, positionToMove) => {
    try {
      // Make board copy
      const boardCopy = _lodash.cloneDeep(board);
      const leftPositions = utils.findAllPositionsByDiagonalDirection(
        boardCopy,
        selectedPiece.color,
        selectedPiece.index,
        constants.LEFT_DIAGONAL_DIRECTION
      );
      const rightPositions = utils.findAllPositionsByDiagonalDirection(
        boardCopy,
        selectedPiece.color,
        selectedPiece.index,
        constants.RIGHT_DIAGONAL_DIRECTION
      );

      const leftMoved = leftPositions.some(
        (item) => item.index === positionToMove.index
      );
      const rightMoved = rightPositions.some(
        (item) => item.index === positionToMove.index
      );
      const positions = leftMoved
        ? leftPositions
        : rightMoved
        ? rightPositions
        : [];

      const jumpedPieces = utils.findAllJumpedPieces(
        positions,
        positionToMove,
        positionToMove.color,
        selectedPiece.isKing
      );

      if (jumpedPieces.length > 0) {
        jumpedPieces.map((item) => {
          item.isAvailable = true;
          savePiece(item).then((data) => {
            refreshBoard([...data]);
          });
          return true;
        });
      }
      return true;
    } catch (e) {
      return await Promise.reject(e);
    }
  };

  return {
    removeJumpedPiece,
    getAvailableJumps,
    getPieceJumpsLeftDirection,
    getPieceJumpsRightDirection,
  };
};

export default useJumps;
