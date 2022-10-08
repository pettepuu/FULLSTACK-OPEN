
const PersonForm = ({ newName, newNumber, HandlePersonsAdding, HandlePersonsNumber, addPerson }) => {
  return (
        <form onSubmit={addPerson}>
        <div>
          name: <input value = {newName}
          onChange={HandlePersonsAdding}
          />
        </div>
        <div>
          number: <input value = {newNumber}
          onChange={HandlePersonsNumber}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm
