import React from "react";

const Total = ({ content }) => {
  const exercises = content.map(({ exercises }) => exercises);
  const sum = exercises.reduce((acc, cur) => acc + cur, 0);

  return <p>Number of exercises {sum}</p>;
};

export default Total;
