import React from "react";
import Chip from "@material-ui/core/Chip";

const ChipLabel = ({ text, color, ...props }) => {
  return <Chip {...props} label={text} clickable color={color} />;
};

export default ChipLabel;
