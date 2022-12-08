const Button = ({person, deleteName}) => { 
    return ( 
      // if we do not use arrow function, then it will immediately execute the function as it is created/rendered
      // we perform a reference to function so that when there is a click, then the click will execute the function
      <button onClick={() => deleteName(person)}> 
        delete
      </button>
    )
  }

export default Button