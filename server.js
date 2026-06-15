/******************************************************************************
* ITE5315 - Assignment 2
* I declare that this assignment is my own work in accordance with Humber
* Academic Policy. No part of this assignment has been copied manually or
* electronically from any other source, including websites, or distributed
* to other students.
*
* I understand that I may use Generative AI for learning, debugging, and
* brainstorming, but the submitted work must be customized to my selected
* dataset and I must be able to explain the code and design decisions.
* Name: ____Yichun,Lien______ Student ID: __n01745009____ Date: __2026.06.16_________
******************************************************************************/
const express = require("express"); 
const { body, validationResult } = require('express-validator');
const path = require("path"); 
const app = express(); 
const port = 5500; 
// TODO: Load your JSON dataset from data/dataset.json /
const gameData = require("./data/dataset-with-images.json");
app.use(express.static(path.join(__dirname, "public")));
//for form
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

function requestLogger(req, res, next) {
    const time = new Date().toLocaleString();
    console.log(`[${time}] ${req.method} ${req.url}`);
    next(); 
}
app.use(requestLogger);

app.get("/", (req, res) => { 
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public/about.html"));
});

app.get("/data", (req, res) => { 
    res.json(gameData);
});

app.get("/data/:id", (req, res) => { 
    const {id} = req.params;
    const record=gameData.find(item => item.Rank === parseInt(id));
    if(record){
        res.json(record);
    } else {
        res.status(404).json({error: "We couldn't find the record "});
    
    }
});

app.get("/search", (req, res) => {
    const {keyword} = req.query;
    if(!keyword){
        return res.status(400).json({error: "Keyword is missing."});
    }
    const results = gameData.filter(item => 
       String(item.Name).toLowerCase().includes(keyword.toLowerCase()) 
    );
    res.json(results);
});

app.get("/filter", (req, res) => {
    const {category} = req.query;
    if(!category){
        return res.status(400).json({error: "Category is missing."});
    }
    const results = gameData.filter(item => 
        item.Genre.toLowerCase() === category.toLowerCase() 
    );
    res.json(results);
});


app.get('/sales', (req, res) => {
    const totalRecords = gameData.length;
    const totalSales = gameData.reduce((sum, item) => sum + item.Global_Sales, 0);
    const averageSales = totalSales / totalRecords;
    res.json({
        description: "Video Games Sales Statistics",
        total_records: totalRecords,
        total_sales_millions: totalSales.toFixed(2),
        average_sales_millions: averageSales.toFixed(2)
    });
});


//new route for Asn2
app.get('/table-js', (req, res) => {
    const displayGames = gameData.slice(0, 50);
    let htmlString = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Video Games Table (JS String)</title>
            <style>
                table { border-collapse: collapse; width: 80%; margin: 20px auto; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1 style="text-align: center;">Video Games Table (Generated via JS String)</h1>
            <div style="text-align: center; margin-bottom: 20px;">
                <a href="/">Back to Home</a>
            </div>
            <table>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Platform</th>
                    <th>Year</th>
                    <th>Genre</th>
                </tr>
    `;

    displayGames.forEach(game => {
        htmlString += `
            <tr>
                <td>${game.Rank}</td>
                <td>${game.Name}</td>
                <td>${game.Platform}</td>
                <td>${game.Year}</td>
                <td>${game.Genre}</td>
            </tr>
        `;
    });

    htmlString += `
            </table>
        </body>
        </html>
    `;
    res.send(htmlString);
});

// use EJS
app.get('/table', (req, res) => {
    res.render("table", {
        pageTitle: "Game Catalogue Explorer",
        records: gameData.slice(0, 50) 
    });
});

//form
app.get('/add-game', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "add-game.html"));
});
// process form submission
app.post('/add-game', [
    // rules
    body('name').notEmpty().withMessage('Game Name is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('year').isInt({ min: 1900, max: 2030 }).withMessage('Year must be a valid number'),
    body('platform').notEmpty().withMessage('Platform is required')
], (req, res) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let errorHtml = '<h3 style="color:red;">Submission Errors:</h3><ul>';
        errors.array().forEach(err => {
            errorHtml += `<li>${err.msg}</li>`;
        });
        errorHtml += '</ul><br><a href="/add-game">Go back and try again</a>';
        
        return res.status(400).send(errorHtml);
    }

    const newRank = gameData.length > 0 ? Math.max(...gameData.map(g => g.Rank)) + 1 : 1;

    const newGame = {
        Rank: newRank, 
        Name: req.body.name,
        Platform: req.body.platform,
        Year: parseInt(req.body.year),
        Genre: req.body.genre,
        Publisher: "User Added", 
        Global_Sales: 0, 
        imageUrl: `https://picsum.photos/seed/${newRank}/600/400`,
        imageAlt: `${req.body.name} image`,
        imageCredit: "Lorem Picsum",
        imageCreditUrl: "https://picsum.photos/",
        description: `A user-added ${req.body.genre} game for ${req.body.platform}.`,
        featured: false
    };

    gameData.push(newGame);

    res.redirect('/table-js');
});

app.use((req, res) => {
    res.status(404).json({error: "404 Error: Page Not Found"});
});

app.listen(port, () => { 
console.log(`Server running at http://localhost:${port}`); });