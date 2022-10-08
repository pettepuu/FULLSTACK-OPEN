import Person from "./Person"

const ChosenPersons = ({ filterByName, removeContact }) => {
    return (
        filterByName.map((person,index) => 
            <div key = {person.name}>
            <Person name={person.name} number={person.number} />
            <button value={person.id} onClick={() => removeContact(person.id)}>
                    delete
            </button>
            </div>)
    )
}

export default ChosenPersons
