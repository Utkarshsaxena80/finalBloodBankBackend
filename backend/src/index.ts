import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express from 'express'
import bbRegis from '../routes/bloodBankRegistration.routes.ts'
import sendOTP from '../routes/send-otp.routes.ts'
import getBanks from '../routes/getBanks.routes.ts'
import addGroup from '../routes/addGroup.routes.ts'

try{
const app=express()
app.use(express.json())
app.use(cookieParser())
const PORT:number=3000

app.use("/user",bbRegis)
app.use("/otp",sendOTP)
app.use("/getBanks",getBanks)
app.use("/create-group",addGroup)


app.listen(PORT,()=>{
   console.log(`running on port https://localhost:${PORT}`)
})
}
catch(error){
   console.error(error)
}