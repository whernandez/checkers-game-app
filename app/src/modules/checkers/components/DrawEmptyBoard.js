import React from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core";

/**
 * @description Draw empty board
 */
const DrawEmptyBoard = () => {
  const classes = useStyles();
  const boxes = [];
  for (let i = 0; i < 8; i++) {
    boxes.push(
      <tr key={i}>
        <td
          className={classnames(classes.box, getBoardClassName(i, 0, classes))}
        />
        <td
          className={classnames(classes.box, getBoardClassName(i, 1, classes))}
        />
        <td
          className={classnames(classes.box, getBoardClassName(i, 2, classes))}
        />
        <td
          className={classnames(classes.box, getBoardClassName(i, 3, classes))}
        />
        <td
          className={classnames(classes.box, getBoardClassName(i, 4, classes))}
        />
        <td
          className={classnames(classes.box, getBoardClassName(i, 5, classes))}
        />
        <td
          className={classnames(classes.box, getBoardClassName(i, 6, classes))}
        />
        <td
          className={classnames(classes.box, getBoardClassName(i, 7, classes))}
        />
      </tr>
    );
  }

  return (
    <table style={{ width: "-webkit-fill-available" }}>
      <tbody>{boxes}</tbody>
    </table>
  );
};

/**
 * @description validate the order as it should begin to color each box in the row. If the index of the row is even, start coloring the lightest color, otherwise the darkest
 * @param rowIndex
 * @param colIndex
 * @param classes
 * @returns {*}
 */
const getBoardClassName = (rowIndex, colIndex, classes) => {
  if (rowIndex % 2 === 0) {
    return colIndex % 2 === 0 ? classes.odd : classes.even;
  } else {
    return colIndex % 2 === 0 ? classes.even : classes.odd;
  }
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
  menuIcon: {
    position: "absolute",
    marginTop: "-20px",
    marginLeft: "-10px",
  },
});

export default DrawEmptyBoard;
