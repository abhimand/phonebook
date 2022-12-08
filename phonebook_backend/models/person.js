const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB...', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3, //built in mongoose method validator
    required: true //built in mongoose method validator
  },
  date: {
    type: Date,
    required: true
  },
  // https://mongoosejs.com/docs/validation.html#custom-validators
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // get _id which is an object and converts it into a string, sets it to id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
