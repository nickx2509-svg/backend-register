import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'

dotenv.config({path:'.env'})


const port = process.env.PORT || 5000

  app.on('error',(err) => {
    console.log("server Error",err)
    process.exit(1)
  })

const serverStart = async () => {
  try {

    await connectDB()
    app.listen(port , () => {
      console.log(`server is running at port ${port}`)
    })
    
  } catch (error) {
    console.log("Failed to lauch server",error)
    process.exit(1)
  }
}

serverStart()