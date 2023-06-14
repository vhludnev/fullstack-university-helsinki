interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

const Header = ({ name }: { name: string }) => <h1>{name}</h1>;

const Part = ({ part }: { part: CoursePart }): JSX.Element | null => {
  switch (part.kind) {
    case "basic":
      return <em>{part.description}</em>;
    case "group":
      return <span>project exercises {part.groupProjectCount}</span>;
    case "background":
      return (
        <>
          <em>{part.description}</em>
          <div>submit to {part.backgroundMaterial}</div>
        </>
      );
    case "special":
      return (
        <>
          <em>{part.description}</em>
          <div>required skills: {part.requirements.join(", ")}</div>
        </>
      );
    default:
      return null;
  }
};

const Content = ({ parts }: { parts: CoursePart[] }) => {
  return (
    <>
      {parts.map((part, idx) => (
        <div key={idx}>
          <h3 style={{ marginBottom: 0 }}>
            {part.name} {part.exerciseCount}
          </h3>
          <Part part={part} />
        </div>
      ))}
    </>
  );
};

const Total = ({ parts }: { parts: CoursePart[] }) => (
  <p>
    Number of exercises{" "}
    {parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
);

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
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
