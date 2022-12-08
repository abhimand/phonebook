import Button from './Button'

const Persons = ({persons, deleteName}) => {  
    return (
      <ul>
        {persons.map(person => 
          <p key={person.name}> 
            {person.name} {person.number} <Button deleteName={deleteName} person={person}/> 
          </p>
        )}
      </ul>
    )
  }

export default Persons