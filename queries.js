const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection URI
const uri = "mongodb://localhost:27017/"; // CHANGE THIS IF USING ATLAS
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function runQueries() {
    try {
        await client.connect();
        const database = client.db('plp_bookstore');
        const books = database.collection('books');

        console.log("\n--- Query Results ---");

        // --- Query 1: Find all books in a specific genre (e.g., 'Fantasy') ---
        console.log("\n1. Books in 'Fantasy' genre:");
        const fantasyBooks = await books.find({ genre: "Fantasy" }).toArray();
        console.log(fantasyBooks);

        // --- Query 2: Find books published after a certain year (e.g., 1950) ---
        console.log("\n2. Books published after 1950:");
        const recentBooks = await books.find({ published_year: { $gt: 1950 } }).toArray();
        console.log(recentBooks);

        // --- Query 3: Find books by a specific author (e.g., 'J.R.R. Tolkien') ---
        console.log("\n3. Books by J.R.R. Tolkien:");
        const tolkienBooks = await books.find({ author: "J.R.R. Tolkien" }).toArray();
        console.log(tolkienBooks);

        // --- Query 4: Update the price of a specific book (e.g., "1984") ---
        console.log("\n4. Updating price of '1984' to 10.00:");
        const updateResult = await books.updateOne(
            { title: "1984" },
            { $set: { price: 10.00 } }
        );
        console.log(`Matched ${updateResult.matchedCount} document(s) and modified ${updateResult.modifiedCount} document(s).`);
        // Verify the update
        const updatedBook = await books.findOne({ title: "1984" });
        console.log("Updated '1984' book:", updatedBook);


        // --- Query 5: Delete a book by its title (e.g., "Moby Dick") ---
        console.log("\n5. Deleting 'Moby Dick':");
        const deleteResult = await books.deleteOne({ title: "Moby Dick" });
        console.log(`Deleted ${deleteResult.deletedCount} document(s).`);
        // Verify the deletion
        const deletedBookCheck = await books.findOne({ title: "Moby Dick" });
        console.log("Check for 'Moby Dick' after deletion:", deletedBookCheck); // Should be null

        console.log("\n--- Task 3: Advanced Query Results ---");

        // --- Query 1: Find books that are both in stock and published after 2010 ---
        console.log("\n1. Books in stock and published after 2010:");
        const inStockRecentBooks = await books.find({
            in_stock: true,
            published_year: { $gt: 2010 }
        }).toArray();

        // --- Query 2: Use projection to return only title, author, and price ---
        console.log("\n2. Books with only Title, Author, and Price (e.g., all books):");
        const projectedBooks = await books.find(
            {}, // Empty query object to find all documents
            { projection: { title: 1, author: 1, price: 1, _id: 0 } } // 1 to include, 0 to exclude _id
        ).toArray();
        console.log(projectedBooks);

        console.log("\n2a. In-stock books published after 2010, with projection:");
        const projectedInStockRecentBooks = await books.find(
            { in_stock: true, published_year: { $gt: 2010 } },
            { projection: { title: 1, author: 1, price: 1, _id: 0 } }
        ).toArray();
        console.log(projectedInStockRecentBooks);


        // --- Query 3: Implement sorting to display books by price (ascending) ---
        console.log("\n3. Books sorted by price (Ascending):");
        const sortedBooksAsc = await books.find({})
            .sort({ price: 1 }) // 1 for ascending
            .toArray();
        console.log(sortedBooksAsc);

        // --- Query 3a: Implement sorting to display books by price (descending) ---
        console.log("\n3a. Books sorted by price (Descending):");
        const sortedBooksDesc = await books.find({})
            .sort({ price: -1 }) // -1 for descending
            .toArray();
        console.log(sortedBooksDesc);


        // --- Query 4: Use limit and skip for pagination (5 books per page) ---
        const booksPerPage = 5;

        // Page 1
        console.log(`\n4. Pagination: Page 1 (first ${booksPerPage} books):`);
        const page1Books = await books.find({})
            .sort({ title: 1 }) // Sorting for consistent pagination order
            .skip(0)
            .limit(booksPerPage)
            .toArray();
        console.log(page1Books);

        // Page 2 (skip the first 5 books)
        const page2Skip = booksPerPage * (2 - 1); // (pageNumber - 1)
        console.log(`\n4a. Pagination: Page 2 (next ${booksPerPage} books, skipping ${page2Skip}):`);
        const page2Books = await books.find({})
            .sort({ title: 1 }) // Sorting for consistent pagination order
            .skip(page2Skip)
            .limit(booksPerPage)
            .toArray();
        console.log(page2Books);

        // You can add more pages if you have enough data, e.g., Page 3:
        const page3Skip = booksPerPage * (3 - 1);
        console.log(`\n4b. Pagination: Page 3 (next ${booksPerPage} books, skipping ${page3Skip}):`);
        const page3Books = await books.find({})
            .sort({ title: 1 })
            .skip(page3Skip)
            .limit(booksPerPage)
            .toArray();
        console.log(page3Books);

        console.log("\n--- Task 4: Aggregation Pipeline Results ---");

        // --- Aggregation 1: Calculate the average price of books by genre ---
        console.log("\n1. Average price of books by genre:");
        const avgPriceByGenre = await books.aggregate([
            {
                $group: {
                    _id: "$genre", // Group by the 'genre' field
                    averagePrice: { $avg: "$price" } // Calculate the average of the 'price' field
                }
            },
            {
                $sort: { averagePrice: -1 } // Optional: Sort by average price descending
            }
        ]).toArray();
        console.log(avgPriceByGenre);

        // --- Aggregation 2: Find the author with the most books in the collection ---
        console.log("\n2. Author with the most books:");
        const authorWithMostBooks = await books.aggregate([
            {
                $group: {
                    _id: "$author", // Group by the 'author' field
                    bookCount: { $sum: 1 } // Count how many books each author has
                }
            },
            {
                $sort: { bookCount: -1 } // Sort by book count in descending order
            },
            {
                $limit: 1 // Get only the top author
            }
        ]).toArray();
        console.log(authorWithMostBooks);

        // --- Aggregation 3: Group books by publication decade and counts them ---
        console.log("\n3. Books grouped by publication decade and count:");
        const booksByDecade = await books.aggregate([
            {
                $addFields: { // Add a new field called 'decade'
                    decade: {
                        $multiply: [ // Multiply to get the decade (e.g., 192 for 1925, then *10 = 1920)
                            { $floor: { $divide: ["$published_year", 10] } }, // Divide by 10 and floor to get e.g., 192 for 1925
                            10
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$decade", // Group by the newly created 'decade' field
                    bookCount: { $sum: 1 } // Count books in each decade
                }
            },
            {
                $sort: { _id: 1 } // Optional: Sort by decade in ascending order
            }
        ]).toArray();
        console.log(booksByDecade);

        console.log("\n--- Task 5: Indexing Results ---");

        // --- Index 1: Create an index on the 'title' field ---
        console.log("\n1. Creating index on 'title' field...");
        // Ensure unique index if titles should be unique, otherwise remove { unique: true }
        try {
            await books.createIndex({ title: 1 });
            console.log("Index on 'title' created successfully.");
        } catch (error) {
            console.log("Index on 'title' might already exist or failed:", error.message);
        }

        // --- Demonstrate performance with explain() for 'title' index ---
        console.log("\n1a. Explaining query for title '1984' (should use index):");
        const explainTitle = await books.find({ title: "1984" }).explain("executionStats");
        console.log("   --- Explain output for title query ---");
        console.log("   Winning Plan Stage:", explainTitle.queryPlanner.winningPlan.stage);
        console.log("   Total Docs Examined:", explainTitle.executionStats.totalDocsExamined);
        console.log("   Total Keys Examined:", explainTitle.executionStats.totalKeysExamined);
        console.log("   (Expected: stage is IXSCAN, totalDocsExamined is low, totalKeysExamined is low)");
        // You can print the full explain object if you want to see all details:
        // console.log(JSON.stringify(explainTitle, null, 2));


        // --- Index 2: Create a compound index on 'author' and 'published_year' ---
        console.log("\n2. Creating compound index on 'author' and 'published_year'...");
        try {
            await books.createIndex({ author: 1, published_year: -1 }); // 1 for ascending, -1 for descending
            console.log("Compound index on 'author' and 'published_year' created successfully.");
        } catch (error) {
            console.log("Compound index might already exist or failed:", error.message);
        }

        // --- Demonstrate performance with explain() for compound index ---
        console.log("\n2a. Explaining query for author 'J.R.R. Tolkien' and year > 1940 (should use compound index):");
        const explainCompound = await books.find({ author: "J.R.R. Tolkien", published_year: { $gt: 1940 } }).explain("executionStats");
        console.log("   --- Explain output for compound query ---");
        console.log("   Winning Plan Stage:", explainCompound.queryPlanner.winningPlan.stage);
        console.log("   Total Docs Examined:", explainCompound.executionStats.totalDocsExamined);
        console.log("   Total Keys Examined:", explainCompound.executionStats.totalKeysExamined);
        console.log("   (Expected: stage is IXSCAN, totalDocsExamined is low, totalKeysExamined is low)");
        // console.log(JSON.stringify(explainCompound, null, 2));


    } catch (error) {
        console.error("An error occurred during indexing or explanation:", error);

    } finally {
        await client.close();
    }
}

runQueries().catch(console.dir);