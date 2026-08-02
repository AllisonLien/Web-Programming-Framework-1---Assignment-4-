
const express = require("express"); 
const { body, validationResult } = require('express-validator');
const path = require("path"); 
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middleware/auth");
const app = express(); 
const port = 5500; 
const Game = require("./models/Game");
app.use(express.static(path.join(__dirname, "public")));
//for form
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/api/users", userRoutes);

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

app.get("/data", async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
app.get("/data/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Game.findOne({ Rank: parseInt(id) });
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: "We couldn't find the record " });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// PUT /data/:id 
app.put('/data/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGame = await Game.findOneAndUpdate(
            { Rank: parseInt(id) },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedGame) {
            return res.status(404).json({ error: "We couldn't find the record" });
        }
        res.json(updatedGame);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// DELETE /data/:id 
app.delete('/data/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGame = await Game.findOneAndDelete({ Rank: parseInt(id) });

        if (!deletedGame) {
            return res.status(404).json({ error: "We couldn't find the record" });
        }
        res.json({ message: "Record deleted successfully", deletedGame });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/search", async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ error: "Keyword is missing." });
        }
        const results = await Game.find({ Name: { $regex: keyword, $options: "i" } });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/filter", async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) {
            return res.status(400).json({ error: "Category is missing." });
        }
        const results = await Game.find({ Genre: { $regex: `^${category}$`, $options: "i" } });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


app.get("/sales", async (req, res) => {
    try {
        const totalRecords = await Game.countDocuments();
        const result = await Game.aggregate([
            { $group: { _id: null, totalSales: { $sum: "$Global_Sales" } } }
        ]);
        const totalSales = result[0]?.totalSales || 0;
        const averageSales = totalSales / totalRecords;

        res.json({
            description: "Video Games Sales Statistics",
            total_records: totalRecords,
            total_sales_millions: totalSales.toFixed(2),
            average_sales_millions: averageSales.toFixed(2)
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


//new route for Asn2
app.get('/table-js', async (req, res) => {
    try {
        const displayGames = await Game.find().limit(50);
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
} catch (err) {
        res.status(500).send("Server error");
    }
});

app.get('/table', async (req, res) => {
    try {
        const records = await Game.find().limit(50);
        res.render("table", {
            pageTitle: "Game Catalogue Explorer",
            records: records
        });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

//form
app.get('/add-game', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "add-game.html"));
});
// process form submission
app.post('/add-game', authMiddleware, [
    body('name').notEmpty().withMessage('Game Name is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('year').isInt({ min: 1900, max: 2030 }).withMessage('Year must be a valid number'),
    body('platform').notEmpty().withMessage('Platform is required')
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let errorHtml = '<h3 style="color:red;">Submission Errors:</h3><ul>';
        errors.array().forEach(err => {
            errorHtml += `<li>${err.msg}</li>`;
        });
        errorHtml += '</ul><br><a href="/add-game">Go back and try again</a>';
        return res.status(400).send(errorHtml);
    }

    try {
        const lastGame = await Game.findOne().sort({ Rank: -1 });
        const newRank = lastGame ? lastGame.Rank + 1 : 1;

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

        await Game.create(newGame);
        res.redirect('/table-js');
    } catch (err) {
        res.status(500).send("Server error");
    }
});
app.use((req, res) => {
    res.status(404).json({error: "404 Error: Page Not Found"});
});

app.listen(port, () => { 
console.log(`Server running at http://localhost:${port}`); });