import React from "react";
import Typography from "@material-ui/core/Typography";

const Title = ({ title, size, ...props }) => (
  <Typography variant={size} {...props}>
    {title}
  </Typography>
);

export default Title;
