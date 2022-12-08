// import './App.css';
import Persons from './Components/Persons'
import PersonForm from './Components/PersonForm'
import Filter from './Components/Filter'
import Notification from './Components/Notification'
import { useState, useEffect } from 'react'
import personService from './Services/persons'

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [persons, setPersons] = useState([]) 
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)

  // send GET request to get all persons in our server
  useEffect(() => {
    personService
      .getAll()
      .then(initalPersons => {
        setPersons(initalPersons)
      })
  }, [])

  // send delete request to server, once deleted need to filter the frontend to show all except deleted
  const deleteName = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(person.id)
      setPersons(persons.filter(p => p.id !== person.id))
    } 
  }

  const addPerson = (event) => { 
    event.preventDefault()

    // create new object with new name and new num, no need to new id as server will create one
    const personObject = {
      name: newName, 
      number: newNum
    }

    // try to find a person that is exact same as our object name
    const foundPerson = persons.find(p => p.name === personObject.name)
    // if found a match, then ask if we want to replace the phone number
    if (foundPerson) { 
      if (window.confirm(`${personObject.name} is already added in the phonebook, replace old phone number with new one?`)) { 
        const newPerson = {...foundPerson, number:newNum} // create copy of person BUT replace with new number with newNum
        personService
          .update(newPerson, foundPerson.id) // sent a PUT request with our new person at previous person location (baseURL + foundPerson.id)
          .then(returnedPerson => {  //returned person is the new person in our server
            setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p)) // set new persons to be the same except replaced with new/returned person once match
            setMessage(`Change ${returnedPerson.name}'s number`)
            setType(true)
            setTimeout(() => {
              setMessage(null)
            }, 2000)
            })
          .catch((error) => { //originally: error => {}
            // setPersons(persons.filter(p => p.id !== foundPerson.id))
            setMessage(error.response.data.error)
            setType(false)
            setTimeout(() => {
              setMessage(null)
            }, 2000)
          })
      }
    } else { 
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage(`Added ${returnedPerson.name}`)
        setType(true)
        setTimeout(() => {
          setMessage(null)
        }, 2000)
      })
      .catch(error => {
        // this is the way to access the error message
        console.log(error.response.data.error)
        setMessage(error.response.data.error)
        setType(false)
        setTimeout(() => {
          setMessage(null)
        }, 2000)
      })
    }
    setNewName('')
    setNewNum('')
  }
  // as user types characters, we set state to the event.target.value aka the input field as it changes aka as user types
  const handlePersonChange = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }

  // same as handlePersonChange expect for num field
  const handleNumChange = (event) => {
    event.preventDefault()
    setNewNum(event.target.value)
  }

  // same as handlePersonChange expect for filter field
  const handleFilterChange = (event) => { 
    event.preventDefault()
    setNewFilter(event.target.value)
  }

  // since the handleFilterChange set state for filter everytime user types in the input field, 
  // the page re-renders and executes the below code, which executes the filter function for persons
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter)) 

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={type}/>

      <Filter handleFilterChange={handleFilterChange}/>

      <h3>add a new</h3>

      <PersonForm 
        addPerson={addPerson} 
        handlePersonChange={handlePersonChange}
        handleNumChange={handleNumChange} 
        newName={newName}
        newNum={newNum}/>

      <h2>Numbers</h2>

      <Persons persons={personsToShow} deleteName={deleteName}/>

    </div>
  )
}

export default App