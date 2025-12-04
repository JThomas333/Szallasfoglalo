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
    const hotels = await res.json();

    talalatok.innerHTML = '';

    if (!hotels || hotels.length == 0) {
        talalatok.textContent = "Nincs elérhető szállás!"
        return;
    }

    hotels.forEach(h => {
        const hotel = document.createElement('div')
        hotel.classList.add('hotel')
        hotel.innerHTML = `
            <h3>${h.name}</h3>
            <p>Hely: ${h.location}</p>
            <p>Ár: ${h.price_per_night} Ft/éjszaka</p>
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
