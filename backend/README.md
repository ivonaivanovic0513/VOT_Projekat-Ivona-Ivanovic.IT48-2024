# E-Gazdinstvo Backend

Backend API za e-commerce aplikaciju **Gazdinstvo Cvejić** — prodaja domaćih poljoprivrednih proizvoda.

## Tehnologije

- Node.js + Express
- MongoDB + Mongoose
- JWT autentifikacija (httpOnly cookies)
- bcryptjs za hash lozinki

## Pokretanje

1. Instaliraj zavisnosti:
```bash
npm install
```

2. Kopiraj `.env.example` u `.env` i podesi vrednosti:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/egazdinstvo
JWT_SECRET=abc123
```

3. Uvezi test podatke:
```bash
npm run data:import
```

4. Pokreni server:
```bash
npm run server
```

Server radi na `http://localhost:5000`

## Test nalozi

| Email | Lozinka | Uloga |
|-------|---------|-------|
| admin@email.com | 123456 | Admin |
| masa@email.com | 123456 | Korisnik |
| sofija@email.com | 123456 | Korisnik |

## API Endpoints

### Proizvodi
- `GET /api/products` — lista proizvoda (pretraga, paginacija)
- `GET /api/products/:id` — detalji proizvoda
- `POST /api/products` — kreiranje (admin)
- `PUT /api/products/:id` — izmena (admin)
- `DELETE /api/products/:id` — brisanje (admin)
- `POST /api/products/:id/reviews` — dodavanje recenzije

### Korisnici
- `POST /api/users/login` — prijava
- `POST /api/users` — registracija
- `POST /api/users/logout` — odjava
- `GET /api/users/profile` — profil
- `PUT /api/users/profile` — ažuriranje profila
- `GET /api/users` — svi korisnici (admin)
- `DELETE /api/users/:id` — brisanje (admin)

### Porudžbine
- `POST /api/orders` — kreiranje porudžbine
- `GET /api/orders/myorders` — moje porudžbine
- `GET /api/orders/:id` — detalji porudžbine
- `PUT /api/orders/:id/pay` — potvrda plaćanja
- `PUT /api/orders/:id/deliver` — označavanje isporuke (admin)
- `GET /api/orders` — sve porudžbine (admin)
