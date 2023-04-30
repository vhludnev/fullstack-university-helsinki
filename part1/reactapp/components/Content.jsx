import React from "react";

const Content = ({ content }) => {
  return (
    <>
      {content.map(({ part, exercises }) => (
        <p>
          {part} {exercises}
        </p>
      ))}
    </>
  );
};

export default Content;
