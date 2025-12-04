import Database from "better-sqlite3";
import bcrypt from "bcrypt";
const db = new Database("./data/database.sqlite")


//users
db.prepare(`
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password_hash TEXT
)`).run();

//hotels
db.prepare(`
  CREATE TABLE IF NOT EXISTS hotels(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    location TEXT,
    price_per_night DOUBLE
)`).run();

//bookings
db.prepare(`
  CREATE TABLE IF NOT EXISTS bookings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    hotel_id INTEGER,
    check_in DATE,
    check_out DATE,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(hotel_id) REFERENCES hotels(id)
)`).run();

export const getUsers = () => db.prepare('SELECT * FROM users').all();
export const getUserById = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id);
export const getUserByEmail = (email) => db.prepare('SELECT * FROM users WHERE email = ?').get(email);
export const saveUser = (name, email, password_hash) => db.prepare('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)').run(name,email,password_hash);


export const getHotels = () => db.prepare('SELECT * FROM hotels').all();
export const getHotelById = (id) => db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
export const getHotelByLocation = (location) => db.prepare('SELECT * FROM hotels WHERE location = ?').all(location) ;
export const saveHotel = (name, location, price_per_night) => db.prepare('INSERT INTO hotels (name, location, price_per_night) VALUES (?,?,?)').run(name, location, price_per_night)

export const getBookings = () => db.prepare('SELECT * FROM bookings').all();
export const getBookingById = (id) => db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
export const getBookingsByUserId = (user_id) => db.prepare('SELECT * FROM bookings WHERE user_id = ?').all(user_id);
export const getBookingsByHotelId = (hotel_id) => db.prepare('SELECT * FROM bookings WHERE hotel_id = ?').all(hotel_id);
export const saveBooking = (user_id, hotel_id, check_in, check_out) => db.prepare('INSERT INTO bookings (user_id,hotel_id,check_in,check_out) VALUES (?,?,?,?)').run(user_id,hotel_id,check_in,check_out);


const users = [
    {name: "Teszt Felhasználó", email: "teszt@teszt.hu", password_hash: bcrypt.hashSync("1234", 10)}
]
if (getUsers().length == 0) {
    users.forEach(u => {
        saveUser(u.name, u.email, u.password_hash)

    });
}
const hotels = [
    {name: "Hotel mámor", location: "Pécs", price_per_night: 2000},
    {name: "Hotel kancsó", location: "Pest", price_per_night: 5000},
    {name: "Tisza hotel", location: "Kecskemét", price_per_night: 3000},
    {name: "Ékes hotel", location: "Szeged", price_per_night: 7000},
]



if (getHotels().length == 0) {
    hotels.forEach(h => {
        saveHotel(h.name, h.location, h.price_per_night)
    });
}
const user = getUsers();
const hotelList = getHotels();
const bookings = [
    {user_id: user[0].id, hotel_id: hotelList[0].id, check_in: "", check_out:""},
    {user_id: user[0].id, hotel_id: hotelList[1].id, check_in: "", check_out:""},
    {user_id: user[0].id, hotel_id: hotelList[2].id, check_in: "", check_out:""},
    {user_id: user[0].id, hotel_id: hotelList[3].id, check_in: "", check_out:""}
];
if (getBookings().length == 0) {
    bookings.forEach(b => {
        saveBooking(b.user_id, b.hotel_id, b.check_in, b.check_out)
    });
}