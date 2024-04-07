import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const URL =
  'mongodb+srv://admin:admin@cluster0.juohnvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const client = new MongoClient(URL)

const Database = 'books'

client.connect().then(() => {
  console.log('Connected!')
  app.listen(9000, () => {
    console.log('listening port 9000')
  })
})

app.get('/books', async (req, res) => {
  res.json(await getBooks())
})

app.get('/categories', async (req, res) => {
  const categories = await getCategories()
  const uniqueCategories = removeDuplicates(categories)
  res.json(uniqueCategories)
})

app.post('/recommendation', async (req, res) => {
  const { title, author, categories } = req.body
  const categoriesArray = removeCommasAndSplit(categories)
  const recommendation = await findRecommendation(
    title,
    author,
    categoriesArray
  )
  res.json(recommendation)
})

function removeCommasAndSplit(categories) {
  return categories.replace(/,/g, ' ').trim().split(' ')
}

async function findRecommendation(title, author, categories) {
  // 1. Versuche ein Buch der gleichen Kategorie zu finden
  let results = await client
    .db(Database)
    .collection('books')
    .find({
      categories: new RegExp(categories.join('|'), 'i'), // Verwende "|" für ODER-Verknüpfung der Kategorien
      title: { $not: new RegExp('^' + title + '$', 'i') },
    })
    .toArray()

  if (results.length > 0) {
    return pickRandomElement(results)
  }

  // 2. Versuche ein Buch zu finden, dessen Kategorie die eingegebene Kategorie enthält
  const categoriesRegex = categories.map(
    (category) => new RegExp(category, 'i')
  )
  results = await client
    .db(Database)
    .collection('books')
    .find({
      categories: { $all: categoriesRegex }, // Überprüfe, ob alle Kategorien im Array vorhanden sind
      title: { $not: new RegExp('^' + title + '$', 'i') },
    })
    .toArray()

  if (results.length > 0) {
    return pickRandomElement(results)
  }

  // 3. Versuche ein Buch vom gleichen Autor zu finden
  results = await client
    .db(Database)
    .collection('books')
    .find({
      authors: author,
      title: { $not: new RegExp('^' + title + '$', 'i') },
    })
    .toArray()

  if (results.length > 0) {
    return pickRandomElement(results)
  }

  // 4. Gib ein zufälliges Buch aus
  const result = await client
    .db(Database)
    .collection('books')
    .aggregate([{ $sample: { size: 1 } }])
    .next()

  return result
}

function pickRandomElement(books) {
  return books[Math.floor(Math.random() * books.length)]
}

function removeDuplicates(categories) {
  const seen = []
  const uniqueArray = []

  for (const category of categories) {
    if (!seen.includes(category)) {
      seen.push(category)
      uniqueArray.push(category)
    }
  }
  uniqueArray.sort((a, b) => a.localeCompare(b))
  return uniqueArray
}

async function getBooks() {
  const result = await client
    .db(Database)
    .collection('books')
    .find({})
    .toArray()
  return result
}

async function getCategories() {
  const result = await client
    .db(Database)
    .collection('books')
    .find({}, { projection: { categories: 1 } })
    .toArray()
  const categories = result.map((doc) => doc.categories)
  return categories
}
