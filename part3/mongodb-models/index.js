require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/info', async (request, response) => {
	const personCount = await Person.countDocuments({})
	response.send(`
    <div>Phonebook has info for ${personCount} people</div></br>
    <div>${new Date().toString()}</div>
  `)
})

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id
	Person.findById(id)
		.then(person => {
			response.json(person)
		})
		.catch(error => {
			response.status(404).json({
				error: 'person does not exist',
			})
		})
})

app.post('/api/persons', async (request, response) => {
	const { name, number } = request.body

	if (!name) {
		return response.status(400).json({
			error: 'name missing',
		})
	}

	if (!number) {
		return response.status(400).json({
			error: 'number missing',
		})
	}

	const persons = await Person.find({})

	if (persons.map(pers => pers.name.toLowerCase()).includes(name.toLocaleLowerCase())) {
		return response.status(400).json({
			error: 'name must be unique',
		})
	}

	const person = new Person({
		name,
		number,
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.delete('/api/persons/:id', async (request, response) => {
	const id = request.params.id
	await Person.deleteOne({ _id: id })
		.then(res => {
			response.json({ deleted: res.deletedCount })
		})
		.catch(error => {
			response.status(400).json({
				error: `error deleting the person, ${error.message} `,
			})
		})
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
