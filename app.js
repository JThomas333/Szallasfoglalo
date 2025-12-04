import express from 'express'
import cors from 'cors'
import * as db from './data/db.js'
import bcrypt from 'bcrypt'

const PORT = 3000;

const app = express()

app.use(express.json())
app.use(cors()) 
app.use(express.static('public'));

app.get('/hotels', (req, res) => {
    const hotels = db.getHotels()
    res.status(200).json(hotels)
})

app.get('/hotels/:id', (req, res) => {
    const hotel = db.getHotelById(req.params.id)
    if (!hotel) {
        return res.status(404).json("Not found!")
    }
    res.status(200).json(hotel)
})

  

app.post('/bookings', (req, res) =>{
    const {user_id, hotel_id, check_in, check_out} = req.body;
    if (!user_id || !hotel_id || !check_in || !check_out) {
        return res.status(400).json("Missing data");
    }
    const result = db.saveBooking(user_id, hotel_id, check_in, check_out);
    const booking = db.getBookings().find(b => b.id === result.lastInsertRowid);
    res.status(201).json(booking);
})
  

app.get('/bookings', (req, res) => {
    const bookings = db.getBookings()
    res.status(200).json(bookings)
})
//log 

app.get('/users/:id', (req,res) =>{
    const user = db.getUserById(+req.params.id)
    if (!user) {
        return res.status(404).json({message: "User not found"})
    }
    res.json(user)
})
app.post('/users',  (req,res) =>{
    const {name, email, password_hash} = req.body
    if (!name || !email || !password_hash) {
        return res.status(400).json({message: "Invalid data"})
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
        return res.status(400).json({message: "Ez az email már foglalt!"});
    }

    const salt =  bcrypt.genSaltSync(10)
    const hashed = bcrypt.hashSync(password_hash, salt)
    const saved = db.saveUser(name, email, hashed)
    const user = db.getUserById(saved.lastInsertRowid)

    res.status(201).json(user)
})

app.post('/login', (req,res) =>{
    const {email,password_hash} = req.body;
    if (!email || !password_hash) {
        return res.status(400).json({message: "Invalid data"})
    }
    const user = db.getUserByEmail(email)
    if (!user) {
         return res.status(404).json({message: "User not found"})
    }
    if (!bcrypt.compareSync(password_hash, user.password_hash)) {
        return res.status(403).json({message: "invalid credention"})
    }

    res.json(user)
})

app.use((err, req, res, next) =>{
    res.status(500).json({error: err.message})
})


app.listen(PORT, () =>{
    console.log("Fut a szerver a " + PORT + "-on")
})