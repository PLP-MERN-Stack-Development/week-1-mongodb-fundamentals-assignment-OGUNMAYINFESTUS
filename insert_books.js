const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection URI
// For local: const uri = "mongodb://localhost:27017/";
// For Atlas: const uri = "mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017/"; // CHANGE THIS IF USING ATLAS

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertBooks() {
    try {
        await client.connect();
        const database = client.db('plp_bookstore');
        const books = database.collection('books');

        const bookDocuments = [
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: "Classic",
                published_year: 1925,
                price: 12.99,
                in_stock: true,
                pages: 180,
                publisher: "Scribner"
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                genre: "Classic",
                published_year: 1960,
                price: 10.50,
                in_stock: true,
                pages: 336,
                publisher: "J. B. Lippincott & Co."
            },
            {
                title: "1984",
                author: "George Orwell",
                genre: "Dystopian",
                published_year: 1949,
                price: 9.75,
                in_stock: false,
                pages: 328,
                publisher: "Secker & Warburg"
            },
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                genre: "Romance",
                published_year: 1813,
                price: 8.99,
                in_stock: true,
                pages: 279,
                publisher: "T. Egerton, Whitehall"
            },
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                genre: "Fantasy",
                published_year: 1937,
                price: 14.25,
                in_stock: true,
                pages: 310,
                publisher: "George Allen & Unwin"
            },
            {
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                genre: "Fiction",
                published_year: 1951,
                price: 11.50,
                in_stock: true,
                pages: 277,
                publisher: "Little, Brown and Company"
            },
            {
                title: "Dune",
                author: "Frank Herbert",
                genre: "Science Fiction",
                published_year: 1965,
                price: 15.99,
                in_stock: true,
                pages: 412,
                publisher: "Chilton Books"
            },
            {
                title: "Moby Dick",
                author: "Herman Melville",
                genre: "Adventure",
                published_year: 1851,
                price: 13.75,
                in_stock: false,
                pages: 635,
                publisher: "Harper & Brothers"
            },
            {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                genre: "Fantasy",
                published_year: 1954,
                price: 22.00,
                in_stock: true,
                pages: 1178,
                publisher: "George Allen & Unwin"
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                genre: "Fiction",
                published_year: 1960,
                price: 12.99,
                in_stock: true,
                pages: 376,
                publisher: "J.B. Lippincott & Co."
            },
            {
                title: "1984",
                author: "George Orwell",
                genre: "Dystopian Fiction",
                published_year: 1949,
                price: 13.99,
                in_stock: true,
                pages: 328,
                publisher: "Secker & Warburg"
            },
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                genre: "Romance",
                published_year: 1813,
                price: 11.99,
                in_stock: false,
                pages: 432,
                publisher: "T. Egerton"
            },
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: "Fiction",
                published_year: 1925,
                price: 10.99,
                in_stock: true,
                pages: 180,
                publisher: "Charles Scribner's Sons"
            },
            {
                title: "Harry Potter and the Philosopher's Stone",
                author: "J.K. Rowling",
                genre: "Fantasy",
                published_year: 1997,
                price: 15.99,
                in_stock: true,
                pages: 223,
                publisher: "Bloomsbury"
            },
            {
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                genre: "Fiction",
                published_year: 1951,
                price: 12.50,
                in_stock: true,
                pages: 277,
                publisher: "Little, Brown and Company"
            },
            {
                title: "Lord of the Flies",
                author: "William Golding",
                genre: "Fiction",
                published_year: 1954,
                price: 11.75,
                in_stock: false,
                pages: 224,
                publisher: "Faber & Faber"
            },
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                genre: "Fantasy",
                published_year: 1937,
                price: 14.99,
                in_stock: true,
                pages: 310,
                publisher: "George Allen & Unwin"
            },
            {
                title: "Brave New World",
                author: "Aldous Huxley",
                genre: "Science Fiction",
                published_year: 1932,
                price: 13.25,
                in_stock: true,
                pages: 268,
                publisher: "Chatto & Windus"
            },
            {
                title: "The Da Vinci Code",
                author: "Dan Brown",
                genre: "Thriller",
                published_year: 2003,
                price: 16.99,
                in_stock: true,
                pages: 689,
                publisher: "Doubleday"
            },
            {
                title: "Crime and Punishment",
                author: "Fyodor Dostoevsky",
                genre: "Philosophical Fiction",
                published_year: 1866,
                price: 16.50,
                in_stock: true,
                pages: 430,
                publisher: "The Russian Messenger"
            }
        ];

        const result = await books.insertMany(bookDocuments);
        console.log(`${result.insertedCount} documents were inserted.`);

    } finally {
        await client.close();
    }
}

insertBooks().catch(console.dir);