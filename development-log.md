#Step 1: From Raw JSON to a User-Friendly Table View
What I Built/Changed: I created the /table-js route and manually constructed an HTML table string by iterating through the dataset using .forEach(). I included column headers for ID, Name, Category, and Image.
Testing and Issue: When testing, I noticed the table layout was messy and hard to read. I also found it very difficult to manage HTML tags inside a JavaScript template string.
Fix: I added basic CSS styling to the manual string to improve the table's readability and ensured all HTML tags were properly closed to maintain a stable layout.

#Step 2: Convert the Table to EJS
What I Built/Changed: I installed ejs and configured the view engine using app.set("view engine", "ejs"). I replaced the manual HTML string building with the res.render() method and created a views/table.ejs template file. I added a new column for "Global Sales" to customize the view for my video game dataset.
Testing and Issue: Initially, the CSS styles were not applying to the rendered EJS page.
Fix: I corrected the link path in table.ejs from ../public/style.css to /style.css. Because Express serves the public folder as the root, this fixed the pathing issue and allowed the CSS to load correctly.

#Step 3: Form Validation and Data Submission
What I Built/Changed: I added a POST /add-game route and a corresponding HTML form. I implemented server-side validation to ensure the game name is not empty and that the year falls within a reasonable range.
Testing and Issue: When submitting invalid data (e.g., an empty name), the server would crash or add incomplete data to the dataset.
Fix: I added conditional if statements to check for valid input before pushing the new record to the gameData array. If validation fails, it now sends a 400 Bad Request error message.

#Step 4: Deployment Readiness & Documentation
What I Built/Changed: I organized my API using a Postman Collection, documenting 11 routes including GET and POST requests. I created a vercel.json file to prepare for deployment and verified the app locally.
Testing and Issue: I confirmed that the application works perfectly in a local development environment.
