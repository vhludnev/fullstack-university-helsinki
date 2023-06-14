interface PartsProps {
  name: string;
  exerciseCount: number;
}

const Header = ({ name }: { name: string }) => <h1>{name}</h1>;

const Content = ({ parts }: { parts: PartsProps[] }) => (
  <>
    {parts.map((part, idx) => (
      <p key={idx}>
        {part.name} {part.exerciseCount}
      </p>
    ))}
  </>
);

const Total = ({ parts }: { parts: PartsProps[] }) => (
  <p>
    Number of exercises{" "}
    {parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
);

const App = () => {
  const courseName: string = "Half Stack application development";

  const courseParts: PartsProps[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  );
};

export default App;
