var Artists = {};
var Artwork = {};

class ScannerLike {
    constructor(inputElement, outputElement) {
        this.input = inputElement;
        this.output = outputElement;
        this.inputQueue = [];
        this.resolve = null;

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = this.input.value.trim();
                this.inputQueue.push(value);
                this.input.value = '';
                if (this.resolve) {
                    this.resolve(this.inputQueue.shift());
                    this.resolve = null;
                }
            }
        });
    }

    async next() {
        return new Promise((resolve) => {
            if (this.inputQueue.length > 0) {
                resolve(this.inputQueue.shift());
            } else {
                this.resolve = resolve;
            }
        });
    }

    async nextInt() {
        const input = await this.next();
        const num = parseInt(input);
        if (isNaN(num)) throw new Error("Invalid integer input");
        return num;
    }

    print(text) {
        const div = document.createElement('div');
        div.textContent = text;
        this.output.appendChild(div);
        this.output.scrollTop = this.output.scrollHeight;
    }

    println(text) {
        this.print(text + '\n');
    }
}


function fetchAPIGET(router, endPoint) {
    return $.ajax({
        type: "GET",
        url: `http://localhost:3000/api/v1/${router}/${endPoint}`,
        dataType: "json"
    });
}

function fetchAPI(method, router, endPoint, data) {
    return $.ajax({
        type: method,
        url: `http://localhost:3000/api/v1/${router}/${endPoint}`,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json"
    });
}


async function addArtwork() {
    scanner.println("Enter artwork title:");
    const title = await scanner.next();
    scanner.println("\t"+title);

    scanner.println("Enter artist ID:");
    const artist_id = await scanner.next();
    scanner.println("\t"+artist_id);
    
    scanner.println("Enter artwork year:");
    const year = await scanner.nextInt();
    scanner.println("\t"+year);
    
    scanner.println("Enter artwork medium");
    const medium = await scanner.next();
    scanner.println("\t"+medium);

    scanner.println("Enter artwork price:");
    const price = await scanner.nextInt();
    scanner.println("\t"+price);
    
    scanner.println("Enter artwork description:");
    const description = await scanner.next();
    scanner.println("\t"+description);
    
    const res = await fetchAPI("POST", "artwork", "", {title,artist_id,year,medium,price,description});
    scanner.println("\nArtwork added successfully");  
}

async function removeArtwork() {
    scanner.println("Enter artwork ID: ");
    const id = await scanner.next();
    scanner.println("\t"+id);
    
    const res = await fetchAPI("DELETE", "artwork", `/${id}`, {});
    if(res.deleted.deletedCount === 0)
        scanner.println("\nArtwork not found");
    else
        scanner.println("\nArtwork removed successfully");
    
}


async function listArtworks(sortBy) {
    const res = await fetchAPIGET("artwork", `allArtworks/${sortBy}` );
    Artwork = res.artworks;
    scanner.println("Artworks:");
    scanner.println(JSON.stringify(Artwork, null, 2));
}

async function addArtist() {
    scanner.println("Enter artist name:");
    const name = await scanner.next();
    scanner.println("\t\t"+name);

    scanner.println("Enter artist bio:");
    const bio = await scanner.next();
    scanner.println("\t\t"+bio);

    scanner.println("Enter artist contact:");
    const contact = await scanner.next();
    scanner.println("\t\t"+contact);

    const res = await fetchAPI("POST", "artist", "", {name,bio,contact});
    scanner.println("\nArtist added successfully");
}

async function removeArtist() {
    scanner.println("Enter artist ID:");
    const id = await scanner.next();
    scanner.println("\t"+id);

    const res = await fetchAPI("DELETE", "artist", `/${id}`, {});
    if(res.deleted.deletedCount === 0)
        scanner.println("\nArtist not found");
    else
        scanner.println("\nArtist removed successfully");
    
}


async function artistById(){
    scanner.println("Enter artist ID:");
    const id = await scanner.next();
    scanner.println("\t"+id);
    const res = await fetchAPIGET("artist", `oneArtist/${id}`);
    scanner.println(JSON.stringify(res.artist, null, 2));
}


async function listArtists(mode) {
    let endpoint;
    if (mode === -1) endpoint = "allArtists"; 
    else endpoint = "allArtistsArtworks"; 

    const res = await fetchAPIGET("artist", endpoint);
    Artists = res.artists;
    scanner.println(mode === 0 ? "\nArtists with Artworks:" : "\nArtists:");
    scanner.println(JSON.stringify(Artists, null, 2));
}

async function searchArtworkByTitle() {
    scanner.println("Enter artwork title:");
    const title = await scanner.next();
    scanner.println("\t\t"+title);

    const res = await fetchAPIGET("artwork", `oneArtwork/${title}`);
    scanner.println("\nSearch results:");
    scanner.println(JSON.stringify(res.artwork, null, 2));
    
}

async function searchArtworkByArtist() {
    scanner.println("Enter artist ID:");
    id = await scanner.next();
    scanner.println("\t"+id);

    const res = await fetchAPIGET("artwork", `artArtworksArtist/${id}`);
    scanner.println("\nArtworks by artist:");
    scanner.println(JSON.stringify(res.artwork, null, 2));
}

async function generateSalesReport() {
    const res = await fetchAPIGET("artwork", "sales");
    scanner.println("\nSales Report:");
    scanner.println("\t"+JSON.stringify({...res.sum}[0].totalPrice, null, 2));
}


const scanner = new ScannerLike(
    document.getElementById('command-input'),
    document.getElementById('terminal')
);

async function mainLoop() {
    while (true) {
        scanner.println("\nArt Gallery Menu:");
        scanner.println("1. Add Artwork");
        scanner.println("2. Remove Artwork");
        scanner.println("3. List Artworks");
        scanner.println("4. Add Artist");
        scanner.println("5. Remove Artist");
        scanner.println("6. List All Artists");
        scanner.println("7. List Artist by ID");
        scanner.println("8. List Artists with Artworks");
        scanner.println("9. Search Artwork by Title");
        scanner.println("10. Search Artwork by Artist");
        scanner.println("11. Generate Sales Report");
        scanner.println("12. Exit\n");
        scanner.println("Enter option (1-12):\n");

        let Input;
        try {
            Input = await scanner.nextInt();
        } catch (error) {
            scanner.println("Invalid option.");
            continue;
        }

        switch (Input) {
            case 1:
                await addArtwork();
                break;
            case 2:
                await removeArtwork();
                break;
            case 3:
                scanner.println("Please enter sorting type\n1. For year\n2. For price");
                let sort;
                sort = await scanner.nextInt();
                switch (sort) {
                    case 1:
                        await listArtworks("year");
                        break;
                    case 2:
                        await listArtworks("price");
                        break;
                    default:
                        scanner.println("Invalid sorting type.");
                }
                break;
            case 4:
                await addArtist();
                break;
            case 5:
                await removeArtist();
                break;
            case 6:
                await listArtists(-1);
                break;
            case 7:
                await artistById();
                break;
            case 8:
                await listArtists(0);
                break;
            case 9:
                await searchArtworkByTitle();
                break;
            case 10:
                await searchArtworkByArtist();
                break;
            case 11:
                await generateSalesReport();
                break;
            case 12:
                scanner.println("Exiting...");
                return;
            default:
                scanner.println("Invalid option.");
        }
    }
}


scanner.println("Welcome to the Art Gallery CLI Emulator");
mainLoop().catch(error => scanner.println(`Error: ${error.message}`));