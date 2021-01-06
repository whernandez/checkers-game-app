import React from "react";
import classnames from "classnames";
import { IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TouchAppIcon from "@material-ui/icons/TouchApp";
// My Components
import Piece from "./Piece";
import { constants } from "core";

const MenuPiece = ({ chooseOptionCallback }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (selectedOption, dataOpion) => {
    setAnchorEl(null);
    if (
      selectedOption !== "CLOSE" &&
      chooseOptionCallback instanceof Function
    ) {
      chooseOptionCallback(selectedOption, dataOpion);
    }
  };

  return (
    <>
      <IconButton
        aria-controls="simple-menu"
        aria-label="more"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon fontSize={"small"} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose("CLOSE")}
      >
        <MenuItem onClick={() => handleClose(constants.SHOW_POSSIBLE_MOVES)}>
          See possible moves
        </MenuItem>
        <MenuItem onClick={() => handleClose(constants.SHOW_POSSIBLE_JUMPS)}>
          See possible jumps
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleClose(
              constants.SHOW_POSSIBLE_WHITE_PIECES_MOVES,
              constants.MAIN_PIECE_COLOR
            )
          }
        >
          See all possible white piece moves
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleClose(
              constants.SHOW_POSSIBLE_RED_PIECES_MOVES,
              constants.SECONDARY_PIECE_COLOR
            )
          }
        >
          See all possible red piece moves
        </MenuItem>
      </Menu>
    </>
  );
};

/**
 * @description Draw board game
 * @param board
 * @param emptyBoard
 * @returns {*}
 * @constructor
 */
const DrawBoard = ({
  board,
  onPressPiece,
  toggleMenu,
  onChooseOption,
  availableMoves,
  onPlay,
}) => {
  const classes = useStyles();
  return (
    <table style={{ width: "-webkit-fill-available" }}>
      <tbody>
        {board.map((row, rowIdx) => {
          return (
            <tr key={rowIdx}>
              {row.map((item, colInx) => {
                return (
                  <td
                    id={item.index}
                    key={colInx}
                    className={classnames(
                      classes.box,
                      getBoardClassName(
                        rowIdx,
                        colInx,
                        availableMoves,
                        item.index,
                        classes
                      )
                    )}
                    onMouseEnter={() => toggleMenu(item)}
                    onMouseLeave={() => toggleMenu(item)}
                  >
                    {!item.isAvailable ? (
                      <>
                        {item.showMenu && (
                          <div className={classes.menuIcon}>
                            <MenuPiece
                              chooseOptionCallback={(
                                selectedOption,
                                dataOption
                              ) =>
                                onChooseOption(selectedOption, dataOption, item)
                              }
                            />
                          </div>
                        )}
                        <Piece
                          onClick={() => onPressPiece(item)}
                          piece={item}
                        />
                      </>
                    ) : (
                      <>
                        {hasAvailableSelection(item.index, availableMoves) && (
                          <TouchAppIcon
                            className={classes.playIcon}
                            onClick={(e) => onPlay(item)}
                          />
                        )}
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

/**
 * @description validate the order as it should begin to color each box in the row. If the index of the row is even, start coloring the lightest color, otherwise the darkest
 * @param rowIndex
 * @param colIndex
 * @param availableMoves
 * @param columnId
 * @param classes
 * @returns {*}
 */
const getBoardClassName = (
  rowIndex,
  colIndex,
  availableMoves,
  columnId,
  classes
) => {
  if (availableMoves.some((item) => item.index === columnId)) {
    return classes.availablePosition;
  }
  if (rowIndex % 2 === 0) {
    return colIndex % 2 === 0 ? classes.odd : classes.even;
  } else {
    return colIndex % 2 === 0 ? classes.even : classes.odd;
  }
};

/**
 *
 * @param columnId
 * @param availableMoves
 * @returns {*}
 */
const hasAvailableSelection = (columnId, availableMoves) => {
  return availableMoves.some((item) => item.index === columnId);
};

// Component style
const useStyles = makeStyles({
  box: {
    width: "100px",
    height: "100px",
  },
  odd: {
    backgroundColor: "#ffeaca",
  },
  even: {
    backgroundColor: "#e2b898",
  },
  availablePosition: {
    backgroundColor: "#90E2CA",
  },
  menuIcon: {
    position: "absolute",
    marginTop: "-20px",
    marginLeft: "-10px",
  },
  playIcon: {
    cursor: "pointer",
  },
});

export default DrawBoard;
