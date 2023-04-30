import Content from "./components/Content";
import Header from "./components/Header";
import Total from "./components/Total";

const App = () => {
  const course = "Half Stack application development";
  const content = [
    {
      exercises: 10,
      part: "Fundamentals of React",
    },
    { exercises: 7, part: "Using props to pass data" },
    { exercises: 14, part: "State of a component" },
  ];

  return (
    <div>
      <Header course={course} />
      <Content content={content} />
      <Total content={content} />
    </div>
  );
};

export default App;
