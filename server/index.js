import express from 'express'
import cors from 'cors'


const app = express()

const port = process.env.PORT || 5000

app.use(cors())

app.use((err, req, res) => {
    res.send({ message: err.message })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})