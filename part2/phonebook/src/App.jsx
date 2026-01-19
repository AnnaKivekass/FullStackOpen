import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, handleDelete }) => (
  <div>
    {persons.map((person) => (
      <div key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={() => handleDelete(person.id, person.name)}>
          delete
        </button>
      </div>
    ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data)
    })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((p) => p.name === newName)

    if (existingPerson) {
      const ok = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!ok) return

      const changedPerson = { ...existingPerson, number: newNumber }

      personService.update(existingPerson.id, changedPerson).then((response) => {
        setPersons(
          persons.map((p) => (p.id !== existingPerson.id ? p : response.data))
        )
        setNewName('')
        setNewNumber('')
      })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject).then((response) => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
    })
  }

  const handleDelete = (id, name) => {
    const ok = window.confirm(`Delete ${name} ?`)
    if (!ok) return

    personService.remove(id).then(() => {
      setPersons(persons.filter((p) => p.id !== id))
    })
  }

  const personsToShow =
    filter === ''
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
