// Hotelek keresés
const kereses = document.getElementById('kereses');
const talalatok = document.getElementById('talalatok');

const keresesfug = async (event) => {
    event.preventDefault();

    const location = document.getElementById('location').value.trim();
    const check_in = document.getElementById('check_in').value;
    const check_out = document.getElementById('check_out').value;

    if (!location || !check_in || !check_out) {
        alert('Töltsd ki az üres mezőket!');
        return;
    }

    // Dátum ellenőrzés
    const inDate = new Date(check_in);
    const outDate = new Date(check_out);
    if (inDate > outDate) {
        alert("A foglalás kezdete nem lehet későbbi, mint a vége!");
        return; // megszakítja a keresést
    }

    try {
        const res = await fetch('http://localhost:3000/hotels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, check_in, check_out })
        });

        const hotels = await res.json();
        talalatok.innerHTML = '';

        if (!hotels || hotels.length == 0) {
            talalatok.innerHTML = `<div class="no-results">Nincs elérhető szállás!</div>`;
            return;
        }

        hotels.forEach(h => {
            const hotelName = h.name.replace(/'/g, "\\'");
            const hotel = document.createElement('div');
            hotel.classList.add('hotel');
            hotel.innerHTML = `
                <h3>${hotelName}</h3>
                <p>Hely: ${h.location}</p>
                <p>Ár: ${h.price_per_night} Ft/éjszaka</p>
                <p><button class="btn-book" onclick="foglalasMegnyit(${h.id}, '${hotelName}', ${h.price_per_night}, '${check_in}', '${check_out}')">Foglalás</button></p>
            `;
            talalatok.appendChild(hotel);
        });
    } catch (err) {
        console.error('Hiba!', err);
        alert('Hiba a hotelek lekérésekor!');
    }
};


// Email validáció
function validEmail(cim) {
    const minta = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return minta.test(cim);
}

// Bejelentkezés
const belep = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("pwd").value;

    if (!validEmail(email)) {
        alert("Hibás e-mail!");
        return;
    }
    if (!password.trim()) {
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

        if (!res.ok) {
            alert(data.message);
            return;
        }

        localStorage.setItem('user', JSON.stringify(data));
        alert("Sikeres bejelentkezés, " + data.email + "!");
        window.location.href = "index.html";

    } catch (e) {
        alert(e.message);
    }
};

// Regisztráció
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
    if (!pw1 || !pw2) {
        alert("A jelszómezők nem lehetnek üresek!");
        return;
    }
    if (pw1 !== pw2) {
        alert("A két jelszó eltér!");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password_hash: pw1 })
        });
        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Sikeres regisztráció!");
        window.location.href = "bejelentkezes.html";

    } catch (err) {
        alert(err.message);
    }
};

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Megerősítő ablak
        const megerosit = confirm("Kilépés: Biztosan ki akarsz jelentkezni?");
        if (megerosit) {
            localStorage.removeItem('user'); // törli a felhasználót
            alert("Sikeres kijelentkezés!");
            window.location.href = 'bejelentkezes.html';
        } else {
            // Nem történt semmi, visszalép a felhasználó
        }
    });
}

// DOMContentLoaded – foglalás adatok megjelenítése foglalas.html-en
document.addEventListener('DOMContentLoaded', () => {
    const info = document.getElementById('hotelInfo');
    const bookingActions = document.getElementById('bookingActions');

    if (info && bookingActions) {
        const sel = JSON.parse(localStorage.getItem('selectedHotel') || 'null');

        if (!sel) {
            info.innerHTML = '<p>Nincs kiválasztott szálloda. Vissza a <a href="index.html">kereséshez</a>.</p>';
            bookingActions.style.display = 'none';
            return;
        }

        info.innerHTML = `
            <h2>${sel.name}</h2>
            <p>Érkezés: ${sel.check_in}</p>
            <p>Távozás: ${sel.check_out}</p>
            <p>Ár/éjszaka: ${sel.price_per_night} Ft</p>
        `;
    }
    const userJs = localStorage.getItem('user');
if (userJs) {
    sajatFoglalasok();
}
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
    const checkIn = new Date(sel.check_in);
    const checkOut = new Date(sel.check_out);

    if (checkIn > checkOut) {
        alert("A foglalás kezdete nem lehet későbbi, mint a vége!");
        return; // megszakítja a foglalást
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
};


// Saját foglalások lekérése és megjelenítése
const sajatFoglalasok = async () => {
    const userJs = localStorage.getItem('user');
    if (!userJs) {
        alert('Jelentkezz be a saját foglalásaid megtekintéséhez!');
        return;
    }
    const user = JSON.parse(userJs);

    try {
        const res = await fetch(`http://localhost:3000/bookings/user/${user.id}`);
        const data = await res.json();

        const container = document.getElementById('sajatFoglalasokList');
        if (!container) return;

        container.innerHTML = '';

        if (!data || data.length == 0) {
            container.innerHTML = '<p>Nincsenek foglalásaid.</p>';
            return;
        }

        data.forEach(b => {
            const div = document.createElement('div');
            div.classList.add('booking');
            div.innerHTML = `
                <h3>${b.hotel_name}</h3>
                <p>Hely: ${b.location}</p>
                <p>Érkezés: ${b.check_in}</p>
                <p>Távozás: ${b.check_out}</p>
                <p>Ár/éjszaka: ${b.price_per_night} Ft</p>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        alert('Hiba a foglalások betöltésekor: ' + err.message);
    }
};
function frissitesLenyitas() {
    const list = document.getElementById('sajatFoglalasokList');
    list.style.display = 'block'; // mindig lenyitja
    sajatFoglalasok(); // frissíti a foglalásokat
}

function osszehajt() {
    const list = document.getElementById('sajatFoglalasokList');
    list.style.display = 'none'; // összecsukja a listát
}

// Hotel kiválasztása a főoldalról
function foglalasMegnyit(hotelId, hotelName, pricePerNight, checkIn, checkOut) {
    const sel = { id: hotelId, name: hotelName, price_per_night: pricePerNight, check_in: checkIn, check_out: checkOut };
    localStorage.setItem('selectedHotel', JSON.stringify(sel));
    window.location.href = 'foglalas.html';
}
