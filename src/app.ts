import express from 'express'
import router from './routes/scraper.routes'
import cors from 'cors'
const app = express()
const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use(cors())

app.use(router)
app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`)
})
