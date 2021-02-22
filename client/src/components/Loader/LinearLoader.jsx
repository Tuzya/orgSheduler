import React from "react";

const LinearLoader = ({prColor = '#ACECE6', indColor = '#26A69A'}) => (
  <div className="progress" style={styles.wrap(prColor)}>
    <div className="indeterminate" style={styles.indeterminate(indColor)}/>
  </div>
);

export default LinearLoader;

const styles = {
  wrap: (prColor) => ({
    display: "flex",
    justyfyContent: "center",
    backgroundColor: prColor,
  }),
  indeterminate: (indColor) => ({
    backgroundColor: indColor,
  }),
};
