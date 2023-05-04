const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2],
	name = process.argv[3],
	number = process.argv[4]

const url = `mongodb+srv://slavaman_testing:${password}@cluster0.x5tiv.mongodb.net/fullstack?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({ name, number })

if (name && number) {
	return person.save().then(result => {
		console.log(`added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
}

return Person.find({}).then(result => {
	console.log('phonebook:')
	result.forEach(person => {
		const { name, number } = person
		console.log(name, number)
	})
	mongoose.connection.close()
})
