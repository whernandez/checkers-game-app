import React, { useContext } from "react";
import { utils, Context } from "core";

const useSavePiece = () => {
  const { board } = useContext(Context.CheckersContext);

  /**
   * Save piece position
   * @param piece
   */
  const savePiece = async (piece) => {
    try {
      const rowIndex = utils.findRowPositions(board, piece.index);
      const selectedRow = board[rowIndex];
      const pieceIndex = utils.findPiecePositionFromRows(
        selectedRow,
        piece.index
      );

      // Set specific position available in selected row
      selectedRow[pieceIndex] = piece;
      board[rowIndex] = selectedRow;
      return await Promise.resolve(board);
    } catch (e) {
      // console.log(e);
      return await Promise.reject(e);
    }
  };

  return [savePiece];
};

export default useSavePiece;
