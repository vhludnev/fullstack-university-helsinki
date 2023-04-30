import { useState } from "react";

const Display = ({ title }) => <h1>{title}</h1>;

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const votesInitial = Array(anecdotes.length).fill(0);

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(votesInitial);

  const generateRandomNumber = (length) => {
    return Math.floor(Math.random() * length);
  };

  const updateVotes = () =>
    setVotes((votes) =>
      votes.map((vote, idx) => (idx === selected ? (vote += 1) : vote))
    );

  const maxVotesIdx = votes.findIndex((vote) => vote === Math.max(...votes));

  return (
    <div>
      <Display title="Anecdote of the day" />
      {anecdotes[selected]}
      <br />
      has {votes[selected]} votes
      <br />
      <Button handleClick={updateVotes} text="vote" />
      <Button
        handleClick={() => setSelected(generateRandomNumber(anecdotes.length))}
        text="next anecdote"
      />
      <Display title="Anecdote with most votes" />
      {anecdotes[maxVotesIdx]}
      <br />
      has {votes[maxVotesIdx]} votes
    </div>
  );
};

export default App;
