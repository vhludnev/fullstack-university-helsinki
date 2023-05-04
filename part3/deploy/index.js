const express = require('express')
const cors = require('cors')

const app = express()

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
]

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/info', (request, response) => {
	response.send(`
    <div>Phonebook has info for ${persons.length} people</div></br>
    <div>${new Date().toString()}</div>
  `)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)
	if (person) {
		response.json(person)
	} else {
		response.status(404).json({
			error: 'person does not exist',
		})
	}
})

/* Generate an id excluding existing ids from the list*/
const generateId = () => {
	const nums = []
	const min = 0
	const max = 1000000
	const idsArrToExclude = persons.length > 0 ? persons.map(n => n.id) : []
	for (let i = min; i <= max; i++) {
		if (!idsArrToExclude.includes(i)) nums.push(i)
	}
	if (nums.length === 0) return false

	const randomIndex = Math.floor(Math.random() * nums.length)
	return nums[randomIndex]
}

app.post('/api/persons', (request, response) => {
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

	if (persons.map(pers => pers.name.toLowerCase()).includes(name.toLocaleLowerCase())) {
		return response.status(400).json({
			error: 'name must be unique',
		})
	}

	const person = {
		name,
		number,
		id: generateId(),
	}

	persons = persons.concat(person)
	response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
