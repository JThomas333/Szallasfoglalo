//Hotelek keresés
const kereses = document.getElementById('kereses')
const talalatok = document.getElementById('talalatok')

const keresesfug = async (event) => {
    event.preventDefault();

    const location = document.getElementById('location').value.trim();
    const check_in = document.getElementById('check_in').value;
    const check_out = document.getElementById('check_out').value;

    if (!location || !check_in || !check_out) {
        alert('Töltsd ki az üres mezőket!');
        return;
    }
    try{
    const res = await fetch('http://localhost:3000/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, check_in, check_out })
    });

    let hotels = await res.json();

    talalatok.innerHTML = '';

    if (!hotels || hotels.length == 0) {
        talalatok.textContent = "Nincs elérhető szállás!"
        return;
    }

    console.log('Talált hotelek:', hotels);


    hotels.forEach(h => {
        const hotel = document.createElement('div')
        hotel.classList.add('hotel')
        hotel.innerHTML = `
            <h3>${h.name}</h3>
            <p>Hely: ${h.location}</p>
            <p>Ár: ${h.price_per_night} Ft/éjszaka</p>
            <p><button class="btn-book" onclick="foglalasMegnyit(${h.id}, '${h.name}', ${h.price_per_night}, '${check_in}', '${check_out}')">Foglalás</button></p>
        `;
        talalatok.appendChild(hotel);
    });
    }catch(err){
        console.error('Hiba!',err)
    }


}

//log

function validEmail(cim) {
    const minta = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return minta.test(cim);
}

const belep = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("pwd").value;

    if (!validEmail(email)) {
        alert("Hibás e-mail!");
        return;
    }
    if (password.trim() == "") {
        alert("A jelszó megadása kötelező!");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password_hash: password })
        });
        const data = await res.json();
        const user = data;

        if (!res.ok) {
            alert(user.message);
            return;
        }
        else {
            localStorage.setItem('user', JSON.stringify(user));
            alert("Sikeres bejelentkezés, " + user.email + "!");
            window.location.href = "index.html";
        }

    } catch (e) {
        alert(e.message);
    }
}

const regist = async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pw1 = document.getElementById("pwd1").value;
    const pw2 = document.getElementById("pwd2").value;

    if (!name) {
        alert("A név megadása kötelező!");
        return;
    }
    if (!validEmail(email)) {
        alert("Hibás e-mail!");
        return;
    }
    if (pw1 == "" || pw2 == "") {
        alert("A jelszómezők nem lehetnek üresek!");
        return;
    }
    if (pw1 != pw2) {
        alert("A két jelszó eltér!");
        return;
    }
     try {
        const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, email, password_hash: pw1 })
        });
        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }
        else{
            alert("Sikeres regisztráció!");
        }

        window.location.href = "bejelentkezes.html";
    } catch (err) {
        alert(err.message);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const sel = JSON.parse(localStorage.getItem('selectedHotel') || 'null');
    const info = document.getElementById('hotelInfo');

    if (!sel) {
        info.innerHTML = '<p>Nincs kiválasztott szálloda. Vissza a <a href="index.html">kereséshez</a>.</p>';
        document.getElementById('bookingActions').style.display = 'none';
        return;
    }

    // Hotel adatainak megjelenítése
    info.innerHTML = `
        <h2>${sel.name}</h2>
        <p>Érkezés: ${sel.check_in}</p>
        <p>Távozás: ${sel.check_out}</p>
        <p>Ár/éjszaka: ${sel.price_per_night} Ft</p>
    `;
});

// Foglalás mentése
const confirmFoglalas = async () => {
    const userJs = localStorage.getItem('user');
    const sel = JSON.parse(localStorage.getItem('selectedHotel') || 'null');

    if (!userJs) {
        alert('Kérlek lépj be a foglaláshoz.');
        window.location.href = 'bejelentkezes.html';
        return;
    }
    if (!sel) {
        alert('Nincs kiválasztott szálloda.');
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(userJs);

    try {
        const res = await fetch('http://localhost:3000/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                hotel_id: sel.id,
                check_in: sel.check_in,
                check_out: sel.check_out
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || 'Foglalás sikertelen');
            return;
        }

        alert('Foglalás sikeres!');
        localStorage.removeItem('selectedHotel');
        window.location.href = 'index.html';

    } catch (err) {
        alert('Hiba: ' + err.message);
    }
}

// Hotel kiválasztása a főoldalról
function foglalasMegnyit(hotelId, hotelName, pricePerNight, checkIn, checkOut) {
    const sel = { id: hotelId, name: hotelName, price_per_night: pricePerNight, check_in: checkIn, check_out: checkOut };
    localStorage.setItem('selectedHotel', JSON.stringify(sel));
    window.location.href = 'foglalas.html';
}
