const PersonForm = (props) => { 

    return ( 
      <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handlePersonChange}/>
        </div>
        <div>
          num: <input value={props.newNum} onChange={props.handleNumChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }

export default PersonForm