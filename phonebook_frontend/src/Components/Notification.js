import '../Styles/Notification.css'

const Notification = ({message, type}) => { 
    if (message === null) { 
        return null
    }

    if (type){ 
        return ( 
            <div className='success'> 
                {message}
            </div>
        )
    }

    if (!type) { 
        return ( 
            <div className='fail'> 
                {message}
            </div>
        )
    }


}

export default Notification