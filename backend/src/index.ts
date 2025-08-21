import cookieParser from 'cookie-parser'
import express from 'express'
import bbRegis from '../routes/bloodBankRegistration.routes.ts'

const app=express()
app.use(express.json())
app.use(cookieParser())
const PORT:number=3000


app.use("/user",bbRegis)
app.use("/user",)
app.listen(PORT,()=>{
   console.log(`running on port https://localhost:${PORT}`)
})