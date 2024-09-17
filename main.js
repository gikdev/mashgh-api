const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const postgres = require("postgres")

// Load environment variables
dotenv.config()

// Database connection
const sql = postgres(process.env.DATABASE_URL)

// Express app setup
const app = express()
const port = process.env.PORT ?? 3000

// Middleware
app.use(express.json())
app.use(cors({
  origin: '*', 
  methods: '*',
  credentials: true,
}))

// Homework model
class Homework {
  constructor({ lesson_name = null, description = null, status = 0, priority = "C" }) {
    this.lesson_name = lesson_name
    this.description = description
    this.status = status
    this.priority = priority
  }
}

// Homework controller
class HomeworkController {
  async index(_, res) {
    const allHomework = await sql`SELECT * FROM homework ORDER BY id DESC`
    res.json(allHomework)
  }

  async create(req, res) {
    const data = req.body
    const hw = new Homework(data)

    try {
      const result = await sql`
        INSERT INTO homework (lesson_name, description, status, priority) 
        VALUES (${hw.lesson_name}, ${hw.description}, ${hw.status}, ${hw.priority})
      `
      res.status(200).send(result)
    } catch (err) {
      res.status(500).send(err)
    }
  }
}

const homeworkController = new HomeworkController()

// Routes
app.get("/homework", homeworkController.index)
app.post("/homework", homeworkController.create)

// Start the server
app.listen(port, () => console.log(`Listening`))
