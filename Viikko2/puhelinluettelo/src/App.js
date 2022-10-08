import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import ChosenPersons from './components/ChosenPersons'
import axios from 'axios'
import personService from './services/contacts'
import Notification from './components/Notifications'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [chosenPersons, setChosenPersons] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(true)
  
  const HandlePersonsAdding = (event) => {setNewName(event.target.value)}
  const HandlePersonsNumber = (event) => {setNewNumber(event.target.value)}

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
        setChosenPersons(initialPersons)
      })
  }, [])

  const personFound = persons.find(persons => persons.name === newName);

  const addPerson = (event) => {
    event.preventDefault()
    if(personFound){
      if (window.confirm(newName + " is already added to phonebook, replace the old number with a new one?")) {
        const updateNumber = {
          name: newName,
          number: newNumber
        }

        const id = personFound.id

        personService
          .update(id, updateNumber)
          .then(returnedContact => {
            const number = returnedContact.number
            setChosenPersons(persons.map(person => {
              if (person.id === id) {
                return { ...person, number }
              }
              else {
                return person
              }
            }))
            setNewName('')
            setNewNumber('')
          })
          .getAll()
          .then(initialContacts =>
            setPersons(initialContacts))


          .catch(error => {
            setErrorMessage(true)
            setMessage(`Information of ${newName} has alreay been removed from the server`)
          })

      }
  }
  
    else{
      const personObject ={
        name: newName,
        number: newNumber,
      }
      personService
        .add(personObject)
          .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setChosenPersons(chosenPersons.concat(returnedPerson))
        })
        .then(added => {
          setErrorMessage(false)
          setMessage("Added" +" "+ newName)

          setTimeout(() => {
            setMessage(null)
          }, 5000)

          setNewName("")
          setNewNumber("")
        })
        .catch(err => {
          setErrorMessage(true)
          setMessage(err.response.data.error)
    })
    }
  }

  const filterByName = (event) => {
    event.preventDefault()
    setNewFilter(event.target.value);
    setChosenPersons(
      persons.filter((person) => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    );
  };

  const removeContact = (id) => {
    const personsTemp = persons.find(persons => persons.id === id);
    console.log(personsTemp)
    personService
        .remove(id)
        .then(returnedContact => {
          setPersons(
            persons.filter((person => person.id !== id)))
            setChosenPersons(
              chosenPersons.filter((person => person.id !== id)))
        })

        .catch(error => {
          setErrorMessage(true)
          setMessage(`Information of ${personsTemp.name} has alreay been removed from the server`)
        })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} boolean={errorMessage}/>
      <Filter value={newFilter} onChange={filterByName} />
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber}
        HandlePersonsAdding={HandlePersonsAdding} HandlePersonsNumber={HandlePersonsNumber}
        addPerson={addPerson} />
      <h3>Numbers</h3>
      <ChosenPersons filterByName={chosenPersons} removeContact={removeContact}/>
    </div>
  )
}

export default App