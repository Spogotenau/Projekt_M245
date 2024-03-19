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

async function getBooks() {
  const result = await client
    .db(Database)
    .collection('books')
    .find({})
    .toArray()
  return result
}
