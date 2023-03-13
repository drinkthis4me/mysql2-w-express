import express, { Request, Response, NextFunction } from 'express'
import mySQLRouter from './routes/mysql.route'
import * as dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3000

app.use(
  cors({
    origin: 'http://localhost:9000',
  })
)

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/mall', mySQLRouter)

// Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!!!').end()
})

// Unknow routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any
  err.status = 404
  next(err)
})

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  err.message = err.message || 'Something went wrong'
  console.error('>>> Something went wrong. ' + err.stack)
  res.status(status).json({ status: status, message: err.message })
})

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
