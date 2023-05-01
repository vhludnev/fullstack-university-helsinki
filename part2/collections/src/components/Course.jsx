const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Course = ({ course }) => {
  const sum = course.parts.reduce((acc, cur) => acc + cur.exercises, 0);
  return (
    <>
      <h2>{course.name}</h2>
      {course.parts.map((part) => (
        <Part part={part} key={part.id} />
      ))}
      <b>total of {sum} exercises</b>
    </>
  );
};

export default Course;
