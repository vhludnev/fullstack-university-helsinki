const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
	.connect(url)
	.then(result => {
		console.log('connected to MongoDB')
	})
	.catch(error => {
		console.log('error connecting to MongoDB:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: [3, '\'{VALUE}\' is shorter than the minimum allowed length (3).'],
		required: [true, 'Person name is required'],
	},
	number: {
		type: String,
		minLength: [8, '\'{VALUE}\' is shorter than the minimum allowed length (8).'],
		validate: {
			validator: function (v) {
				return /^[0-9]{2,3}[-][0-9]{5,}/.test(v)
			},
			msg: props => `${props.value} is not a valid phone number!`,
		},
		required: [true, 'Person phone number is required'],
	},
})

/* Mongoose schema transform (add "id" as String and remove "_id", "_v") */
personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Person', personSchema)
