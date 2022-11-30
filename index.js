
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456",
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523",
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345",
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    }
  ]
  
  app.get('/info', morgan('tiny'), (req, res) => {
    const personslenght = persons.length
    console.log(personslenght)
    const date = Date()
    console.log(date)
    res.send(
      `<p>Phonebook has info for ${personslenght} people</p>
      <p>${date}</p>`)
  })


  app.get('/api/persons', morgan('tiny'), (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', morgan('tiny'), (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person ) {
      response.json(person)
    }
    response.status(404).end()
    
  })

  app.delete('/api/persons/:id', morgan('tiny'), (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
  })

  const generateId = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min) + min)

  }

  morgan.token('body', (req) => JSON.stringify(req.body))
  app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (req, res) => {
    const body = req.body
  
    if (!body.name) {
      return res.status(400).json({ 
        error: 'name missing' 
      })
    }

    const personsName = persons.map(person => person.name)

    


    if (personsName.includes(body.name)) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }
  
    const person = {
      id: generateId(1, 10000000),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    res.json(person)
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})