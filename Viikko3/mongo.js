/*
const mongoose = require('mongoose')

const password = process.argv[2]

const url =
`mongodb+srv://ppuusti:${password}@cluster0.fhcfptr.mongodb.net/Persons?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

if (process.argv.length === 5) {
    person.save().then(persons => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
        process.exit(1)
    })
}

if (process.argv.length === 3) {
    Person.find({}).then(persons =>{
        persons.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}
*/