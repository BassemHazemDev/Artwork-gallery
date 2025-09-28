# Artwork Gallery

Artwork Gallery is a small Express + MongoDB REST API with a minimal client-side CLI-like front-end. It allows managing artists and artworks, listing artworks and artists, viewing artworks grouped by artist, and a simple sales report (sum of artwork prices).

This README documents the project's structure, installation and run instructions, API endpoints, data models, and helpful notes.

## Table of contents

- Project overview
- Repo structure
- Prerequisites
- Installation
- Running the application
- API endpoints
- Data models
- Client side
- Notes & troubleshooting

## Project overview

- Server: Node.js (ES modules) + Express + Mongoose (MongoDB)
- Client: Static HTML + minimal JS (a CLI emulator style front-end)
- Purpose: Demonstration / small gallery management backend with CRUD operations for artists and artworks.

## Repo structure

- Client side/
  - index.html - Minimal front-end CLI emulator
  - css/ - styles
  - js/ - client JavaScript (index.js) and jQuery

- Server side/
  - index.js - Express app entry point
  - package.json - Node dependencies and scripts
  - database/
    - connection/connection.js - Mongoose connection helper
    - models/
      - artist/artist.model.js - Mongoose model for Artist
      - artwork/artwork.model.js - Mongoose model for Artwork
  - src/modules/
    - artist/ - Artist routes and controller
    - artwork/ - Artwork routes and controller

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally (default connection string used: mongodb://localhost:27017/gallery)
- npm (comes with Node.js)

## Installation

1. Open a terminal in the repository root ("Artwork-gallery").
2. Install server dependencies:

```powershell
cd "Server side"; npm install
```

## Running the application

Start MongoDB (if not running). Then run the server:

```powershell
cd "Server side"; npm start
```

By default the app listens on port 3000. You can verify the server by visiting http://localhost:3000/ which should respond with "Start".

The client is static files in `Client side/`. You can open `Client side/index.html` directly in a browser for demo purposes.

## API endpoints

Base URL: http://localhost:3000/api/v1

Artist endpoints (/api/v1/artist)

- GET /allArtists
  - Description: Returns all artists.
  - Response: 200 { message: "Successful showing", artists: [...] }

- GET /allArtistsArtworks
  - Description: Returns all artists with their artworks embedded.
  - Response: 200 { message: "Successful showing", artists: [ { ...artist, artworks: [...] }, ... ] }

- GET /oneArtist/:id
  - Description: Returns a single artist by id with their artworks.
  - URL params: id - artist ObjectId
  - Responses:
    - 200 { message: "Successful showing", artist: { ...artist, artworks: [...] } }
    - 400 missing id
    - 404 artist not found

- POST /
  - Description: Create a new artist.
  - Body (JSON): { name: string, bio: string, contact: string }
  - Responses:
    - 201 { message: "Successful adding", artist: [...] }
    - 400 validation failed

- DELETE /:id
  - Description: Delete an artist and all artworks that reference them.
  - URL params: id - artist ObjectId
  - Responses: 200 { message: "Successful deleting", deleted, deletedArtworks }

Artwork endpoints (/api/v1/artwork)

- GET /allArtworks/:sortBy
  - Description: Returns all artworks sorted by `price` or `year`. Pass `price` to sort by price, otherwise sorts by year.
  - URL params: sortBy - "price" or other string for year
  - Response: 200 { message: "Successfully showing", artworks: [...] }

- GET /oneArtwork/:title
  - Description: Return artwork(s) matching the given title.
  - URL params: title - artwork title
  - Responses:
    - 200 { message: "Successful showing", artwork: [...] }
    - 400 missing title
    - 404 not found

- GET /artArtworksArtist/:id
  - Description: Return artworks by artist id.
  - URL params: id - artist ObjectId
  - Responses:
    - 200 { message: "Successful showing", artwork: [...] }
    - 400 missing id
    - 404 not found

- GET /allArtworksAllArtists
  - Description: Returns all artworks with artist details embedded.
  - Response: 200 { message: "Successful showing", artworks: [ { ...artwork, artist: [...] }, ... ] }

- GET /sales
  - Description: Returns aggregated sales report (sum of artwork prices).
  - Response: 200 { message: "Successfully reported", sum: [ { _id: null, totalPrice: X } ] }

- POST /
  - Description: Create a new artwork.
  - Body (JSON): { title: string, artist_id: ObjectId, year: number, medium: string, price: number, description: string }
  - Responses:
    - 201 { message: "Successful adding", artwork: [...] }
    - 400 validation failed

- DELETE /:id
  - Description: Delete an artwork by id.
  - URL params: id - artwork ObjectId
  - Response: 200 { message: "Successful deleting", deleted }

## Data models

Artist
- name: string (unique, required, minLength 2)
- bio: string (required, minLength 10)
- contact: string (unique, required, minLength 11)

Artwork
- title: string (unique, required, minLength 2)
- artist_id: ObjectId ref to Artist
- year: number (required, min 1900)
- medium: string (required)
- price: number (required, min 0)
- description: string (required)

## Client side

The `Client side/index.html` is a tiny CLI-style emulator. It references `css/style.css` and `js/index.js`. The client is primarily for demonstration and may not fully exercise the API.

## Notes & troubleshooting

- The server uses ES modules (package.json has "type": "module").
- MongoDB is expected at mongodb://localhost:27017/gallery. Change `Server side/database/connection/connection.js` if you need a remote DB or credentials.
- The `package.json` start script uses `nodemon index.js` so `npm start` will run with hot reload if `nodemon` is installed (it's currently a dependency in package.json). If you prefer plain node, run `node index.js`.
- If you get validation errors when creating artists/artworks, check required fields and types.

## Next steps / improvements

- Add tests (unit/integration) for API endpoints.
- Improve client UI to provide interactive CRUD actions.
- Add authentication/authorization for protected writes.

---

If you'd like, I can:
- Add example curl or Postman requests for each endpoint.
- Wire the client to call the API directly and provide a UI to manage artists/artworks.
- Add Docker support (Dockerfile + docker-compose) to run MongoDB + server.

