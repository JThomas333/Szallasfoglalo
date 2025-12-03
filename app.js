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


app.listen(PORT, () =>{
    console.log("Fut a szerver a " + PORT + "-on")
})