const Filter = ({ name, updateFilterName }) => {
  const handleFilterNameChange = event => {
    updateFilterName(event.target.value)
  }

  return (
    <div>
      filter shown with <input value={name} onChange={handleFilterNameChange} />
    </div>
  )
}

export default Filter
