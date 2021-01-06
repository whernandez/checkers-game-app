import React, { useContext } from "react";
import { utils, Context } from "core";
import _lodash from "lodash";

const useToggleMenuPiece = () => {
  const { board, refreshBoard } = useContext(Context.CheckersContext);

  /**
   * Show / Hide menu options
   * @param piece
   */
  const toggleMenuPiece = async (piece) => {
    try {
      // Works only when position is not locked and is not available (has a piece)
      if (!piece.isLocked && !piece.isAvailable) {
        const pieceClone = _lodash.cloneDeep(piece);

        // Make board copy
        const boardCopy = _lodash.cloneDeep(board);

        const rowIndex = utils.findRowPositions(boardCopy, pieceClone.index);

        const selectedRow = boardCopy[rowIndex];
        const pieceIndex = utils.findPiecePositionFromRows(
          selectedRow,
          pieceClone.index
        );

        // Show Menu to a specific position in hover row
        selectedRow[pieceIndex].showMenu = !pieceClone.showMenu;
        boardCopy[rowIndex] = selectedRow;

        // Refresh state
        refreshBoard([...boardCopy]);
        return true;
      }
      throw "This position does not have a piece.";
    } catch (e) {
      return await Promise.reject(e);
    }
  };

  return [toggleMenuPiece];
};

export default useToggleMenuPiece;
