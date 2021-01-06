import { constants, utils } from "./index";
import _lodash from "lodash";

/**
 * get date now in UTC timezone format, ex: "Sat, 13 Jun 2020 18:30:00 GMT"
 * @returns {string}
 */
const getDateNow = () => {
  const date = new Date();
  return date.toUTCString();
};

/**
 * Find row position depending in the index and color
 * @param board
 * @param color
 * @param index
 * @returns {*}
 */
const findRowPositions = (board, index) => {
  /* Find row position in board */
  return board.findIndex((row) => {
    return row.some((item) => {
      return item.index === index;
    });
  });
};

/**
 * Find piece position from a row depending in the index
 * @param rows
 * @param index
 * @returns {*}
 */
const findPiecePositionFromRows = (rows, index) => {
  return rows.findIndex((item) => {
    return item.index === index;
  });
};

/**
 * Recursive Function
 * Return all position where piece can move or jump
 * @param board
 * @param color
 * @param positionIndex
 * @param direction
 * @param positions
 * @returns {Array}
 */
const findAllPositionsByDiagonalDirection = (
  board,
  color,
  positionIndex = 0,
  direction,
  positions = []
) => {
  try {
    let foundLockedPosition = false;

    if (color === constants.MAIN_PIECE_COLOR) {
      positionIndex =
        positionIndex +
        (direction === constants.RIGHT_DIAGONAL_DIRECTION ? 9 : 7);
    }
    if (color === constants.SECONDARY_PIECE_COLOR) {
      positionIndex =
        positionIndex -
        (direction === constants.LEFT_DIAGONAL_DIRECTION ? 9 : 7);
    }

    if (positionIndex < 0 || positionIndex > 63) {
      return positions;
    }

    board.forEach((pos) => {
      const found = pos.find((item) => {
        return item.index === positionIndex;
      });
      if (found) {
        if (found.isLocked) {
          foundLockedPosition = true;
        } else {
          positions.push(found);
        }
      }
    });

    if (foundLockedPosition) {
      return positions;
    }

    return findAllPositionsByDiagonalDirection(
      board,
      color,
      positionIndex,
      direction,
      positions
    );
  } catch (e) {
    // console.log(e)
  }
};

/**
 * Recursive Function
 * Return all positions where piece could jump
 * @param positions
 * @param piece
 * @param color
 * @param direction
 * @param isKing
 * @param jumps
 * @returns {(Array|undefined)|Array}
 */
const findAllPossibleJumpPositions = (
  positions = [],
  piece,
  color,
  direction,
  isKing = false,
  jumps = []
) => {
  let jumpPosition = null;
  if (positions.length === 0) {
    return positions;
  }
  if (!isKing) {
    // Validate first position is busy
    if (!positions[0].isAvailable) {
      positions.forEach((pos, index) => {
        if (color === constants.MAIN_PIECE_COLOR) {
          if (
            piece.index +
              (direction === constants.LEFT_DIAGONAL_DIRECTION ? 14 : 18) ===
            pos.index
          ) {
            jumpPosition = pos;
          }
        }
        if (color === constants.SECONDARY_PIECE_COLOR) {
          if (
            piece.index -
              (direction === constants.RIGHT_DIAGONAL_DIRECTION ? 14 : 18) ===
            pos.index
          ) {
            jumpPosition = pos;
          }
        }
      });

      // Take jump position if is available
      if (jumpPosition && jumpPosition.isAvailable) {
        jumps.push(jumpPosition);
      }
      // Return jumps when are not found
      if (jumpPosition === null) {
        return jumps;
      }

      return findAllPossibleJumpPositions(
        positions,
        jumpPosition,
        color,
        direction,
        false,
        jumps
      );
    }
    return jumps;
  }
};

/**
 * Return all positions that would be jumped
 * @param positions
 * @param piece
 * @param color
 * @param isKing
 * @returns {Array}
 */
const findAllJumpedPieces = (positions = [], piece, color, isKing = false) => {
  const jumpedPieces = [];

  if (positions.length === 0) {
    return positions;
  }
  if (!isKing) {
    // Validate first position is busy
    if (positions[0].isAvailable) {
      return positions;
    }
  }
  positions.forEach((pos, index) => {
    if (color === constants.MAIN_PIECE_COLOR) {
      if (pos.index <= piece.index && pos.index !== piece.index) {
        if (!pos.isAvailable) {
          jumpedPieces.push(pos);
        }
      }
    }

    if (color === constants.SECONDARY_PIECE_COLOR) {
      if (pos.index >= piece.index && pos.index !== piece.index) {
        if (!pos.isAvailable) {
          jumpedPieces.push(pos);
        }
      }
    }
  });
  return jumpedPieces;
};

/**
 * Return true if piece become to king
 * @param board
 * @param piece
 * @returns {boolean}
 */
const mustPieceBecomeKing = (board, piece) => {
  if (
    piece.color === constants.MAIN_PIECE_COLOR &&
    piece.index > 55 &&
    piece.index < 64
  ) {
    return true;
  }
  return (
    piece.color === constants.SECONDARY_PIECE_COLOR &&
    piece.index > 0 &&
    piece.index < 8
  );
};

/**
 * Recursive Function
 * Return all position where piece can move
 * @param board
 * @param leftDown
 * @param rightDown
 * @param leftUp
 * @param rightUp
 * @param positions
 * @returns {Array}
 */
const findAllPossibleMovesByKing = (
  board,
  leftDown = 0,
  rightDown = 0,
  leftUp = 0,
  rightUp = 0,
  positions = []
) => {
  leftDown = leftDown + 7;
  rightDown = rightDown + 9;
  leftUp = leftUp - 7;
  rightUp = rightUp - 9;

  if (
    (leftDown < 0 || leftDown > 63) &&
    (rightDown < 0 || rightDown > 63) &&
    (leftUp < 0 || leftUp > 63) &&
    (rightUp < 0 || rightUp > 63)
  ) {
    return removeArrayPiecesDuplication(positions);
  }

  board.forEach((pos) => {
    const foundLeftDown = pos.find((item) => {
      return item.index === leftDown && item.isAvailable;
    });
    const foundRightDown = pos.find((item) => {
      return item.index === rightDown && item.isAvailable;
    });
    const foundLeftUp = pos.find((item) => {
      return item.index === leftUp && item.isAvailable;
    });
    const foundRightUp = pos.find((item) => {
      return item.index === rightUp && item.isAvailable;
    });

    if (foundLeftDown && !foundLeftDown.isLocked) {
      positions.push(foundLeftDown);
    }
    if (foundRightDown && !foundRightDown.isLocked) {
      positions.push(foundRightDown);
    }
    if (foundLeftUp && !foundLeftUp.isLocked) {
      positions.push(foundLeftUp);
    }
    if (foundRightUp && !foundRightUp.isLocked) {
      positions.push(foundRightUp);
    }
  });

  return findAllPossibleMovesByKing(
    board,
    leftDown,
    rightDown,
    leftUp,
    rightUp,
    positions
  );
};

/**
 * Recursive Function
 * Return the possible moves in left direction for a single piece
 * @param rec
 * @param piece
 * @param board
 * @returns {*}
 */
const getPieceMovingLeftDirection = (board, piece, rec = 0) => {
  try {
    const pieceClone = _lodash.cloneDeep(piece);
    let diagonalDirection = 0;
    let foundPiece = null;

    if (pieceClone.color === constants.MAIN_PIECE_COLOR) {
      diagonalDirection = Math.abs(pieceClone.index + 9);
    }
    if (pieceClone.color === constants.SECONDARY_PIECE_COLOR) {
      diagonalDirection = Math.abs(pieceClone.index - 9);
    }

    board.forEach((positions) => {
      const found = positions.find((item) => {
        return item.index === diagonalDirection;
      });
      if (found) {
        foundPiece = found;
      }
    });

    if (foundPiece && foundPiece.isAvailable && !foundPiece.isLocked) {
      return foundPiece;
    }

    if (rec > 2) {
      return null;
    }

    rec = rec + 1;
    return getPieceMovingLeftDirection(board, piece, rec);
  } catch (e) {
    // console.log(e);
    return null;
  }
};

/**
 * Recursive Function
 * Return the possible moves in right direction for a single piece
 * @param board
 * @param piece
 * @param rec - recursive count
 * @returns {*}
 */
const getPieceMovingRightDirection = (board, piece, rec = 0) => {
  try {
    const pieceClone = _lodash.cloneDeep(piece);
    let diagonalDirection = 0;
    let foundPiece = null;

    if (pieceClone.color === constants.MAIN_PIECE_COLOR) {
      diagonalDirection = Math.abs(pieceClone.index + 7);
    }
    if (pieceClone.color === constants.SECONDARY_PIECE_COLOR) {
      diagonalDirection = Math.abs(pieceClone.index - 7);
    }

    board.forEach((positions) => {
      const found = positions.find((item) => {
        return item.index === diagonalDirection && item.isAvailable;
      });
      if (found) {
        foundPiece = found;
      }
    });

    if (foundPiece && foundPiece.isAvailable && !foundPiece.isLocked) {
      return foundPiece;
    }

    if (rec > 2) {
      return null;
    }

    rec = rec + 1;
    return getPieceMovingRightDirection(board, piece, rec);
  } catch (e) {
    // console.log(e);
    return null;
  }
};

/**
 * Return all possible moves to a specific color
 * @param board
 * @param color
 * @returns []
 */
const getAllAvailablePieceMovesByColor = (board, color) => {
  const moves = [];
  board.forEach((pieces) => {
    pieces.map((item) => {
      if (item.color === color) {
        const positionLeft = utils.getPieceMovingLeftDirection(board, item);
        const positionRight = utils.getPieceMovingRightDirection(board, item);
        if (positionLeft) {
          moves.push(positionLeft);
        }
        if (positionRight) {
          moves.push(positionRight);
        }
      }
      return true;
    });
  });
  return removeArrayPiecesDuplication(moves);
};

/**
 * Remove possible duplicated
 * @param pieces
 * @returns {*}
 */
const removeArrayPiecesDuplication = (pieces) => {
  // Remove possible duplicated
  const indexes = pieces.map((p) => p.index);
  return pieces.filter(({ index }, i) => !indexes.includes(index, i + 1));
};

/**
 * Return all pieces available to be move
 * @param board
 * @param color
 */
const getRandomPieceToMoveByColor = (board, color) => {
  let pieces = [];
  board.forEach((positions) => {
    const found = positions.filter((piece) => piece.color === color);
    if (found.length > 0) {
      pieces = [...pieces, ...found];
    }
  });
  const availablePiecesToMove = [];
  pieces.forEach((piece) => {
    if (!piece.isLocked) {
      const pieceMoveToRight = utils.getPieceMovingRightDirection(board, piece);
      const pieceMoveToLeft = utils.getPieceMovingLeftDirection(board, piece);
      if (pieceMoveToRight) {
        availablePiecesToMove.push(piece);
      }
      if (pieceMoveToLeft) {
        availablePiecesToMove.push(piece);
      }
    }
  });

  return removeArrayPiecesDuplication(availablePiecesToMove);
};

/**
 * Return all available pieces by color
 * @param board
 * @param color
 * @returns {Array}
 */
const getAvailablePiecesToPlayByColor = (board, color) => {
  try {
    let pieces = [];
    board.forEach((positions) => {
      const found = positions.filter(
        (piece) =>
          piece.color === color && !piece.isAvailable && !piece.isLocked
      );
      if (found.length > 0) {
        pieces = [...pieces, ...found];
      }
    });
    return pieces;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export {
  getDateNow,
  findRowPositions,
  findPiecePositionFromRows,
  findAllPositionsByDiagonalDirection,
  findAllPossibleJumpPositions,
  findAllJumpedPieces,
  mustPieceBecomeKing,
  findAllPossibleMovesByKing,
  getPieceMovingLeftDirection,
  getPieceMovingRightDirection,
  getAllAvailablePieceMovesByColor,
  removeArrayPiecesDuplication,
  getRandomPieceToMoveByColor,
  getAvailablePiecesToPlayByColor,
};
