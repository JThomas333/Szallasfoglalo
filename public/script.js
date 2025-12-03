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