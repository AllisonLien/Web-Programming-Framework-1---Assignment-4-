**README Questions**
1. What is the difference between your /table-js route and your /table route?
The /table-js route manually builds the HTML table by using JavaScript strings and sends the raw string to the browser using res.send(). The /table route uses the EJS to achieve separation of concerns; it passes the data array to the views/table.ejs file using res.render(), which handles the HTML structure cleanly.
2. What does app.set("view engine", "ejs") do?
It tells the Express application to use EJS as the default template engine. This allows Express to automatically look for .ejs files in the views directory and parse them into standard HTML before sending the response to the client.
3. What does res.render("table", { records: dataset }) do?
It leads Express to locate the table.ejs template file, compile it, and inject the dataset array into the template under the variable name records. Once the dynamic data is embedded into the HTML structure, it sends the final rendered HTML page back to the user's browser.
4. What did you change in table.ejs to customize it for your dataset?
I customized the table.ejs file to display my Video Game sales data. I changed the page heading to Game Catalogue Explorer and updated the table headers and data loops to use the real fields from my JSON file: Rank as the unique ID, Name, Genre, Platform, and Global_Sales.
5. Did you deploy the app? If yes, provide the link. If not, explain the deployment issue.
Yes I did.
Github:https://github.com/AllisonLien/Webprograming_Assignment2
Vercel:https://webprograming-assignment2.vercel.app/


**Route Mapping **(Domain Customization)**
Home Route-GET / : The main landing page with links to all endpoints.
All Data- GET /data:  Returns the complete video game dataset in JSON format.
One Record- GET /data/:id: Returns a specific game matched by its Rank (ID). 
GET /search: Searches for games by their Name using req.query.
GET /filter: Filters games by Genre using req.query
Custom Feature-GET /sales: Returns calculated total and average global sales statistics. 
GET /table-js: Displays 50 games using a manually built HTML string table.
Table View-GET /table: Displays games beautifully using the EJS template engine. 
Form Page-GET /add-game: Renders the HTML form to submit a new video game. 
Submit Data- POST /add-game: Processes the form submission with validation. 



**Step1 Check point**
Q:Explain the command you used to run add-images.js. What are the input file, output file, category-like field, and title/name field in your command? 
A:node tools/add-images.js data/dataset.json data/dataset-with-images.json Genre Name
input file: data/dataset.json
output file: data/dataset-with-images.json 
category-like field:Genre
title/name field :Name
Q:Also explain what would happen if your dataset does not have the field name you passed as categoryField.
If the Genre field is not exist in my dataset (or spelling errors or capitalization mismatches).This can trigger the serious consequences: generating undefined error values, generating invalid image links (broken links), and potential script crashes.

**Step3 Check point**
Visit /data, /table, and submit your /add form. Copy three logger outputs from your terminal and explain what each line tells you about the reques
[6/13/2026, 2:02:49 PM] GET /data
This indicates that the client made a GET request to retrieve the JSON dataset from the /data route.
[6/13/2026, 2:03:08 PM] GET /table
This shows a GET request to the /table route, which means the user navigated to the page that displays the EJS HTML table of the video games dataset.
[6/13/2026, 2:03:37 PM] GET /add-game
This shows a POST request to the /add-game route. The POST method indicates that the user has submitted the HTML form to add a new game record. The data from the form is included in the request body, not in the URL.

**Step5 Check point**
1.Submit the form once with valid data and once with missing or invalid data. What response did your app return in each case?
The application successfully passed the verification, added the data to the array in memory, and redirected the page to the /table-js table page, where I could see the newly added game at the bottom of the table.
When incorrect information is entered, the application redirects to a new page displaying a list of error messages at the top.
2.Which validation rule stopped the invalid submission?
The notEmpty() rule intercepted an empty Name field.
The isInt({ min: 1900, max: 2030 }) rule intercepted input that did not conform to the year range.

**Step7 Check point**
Compare /table-js and /table. 
1.Which one mixes HTML directly inside server.js? 
The /table-js route mixes HTML directly inside server.js. It does this by concatenating HTML tags into a JavaScript string variable and then sending that large string to the browser via res.send().
2.Which one uses res.render()? In your own words?
The /table route uses res.render() to inject data into a separate .ejs file. The server handles the logic (data preparation), and the EJS template handles the presentation (HTML structure).
3.why is the EJS version easier to maintain?
The EJS version is easier to maintain because it code clarity: the HTML  stays in the .ejs file. Also good at debugging, if the layout breaks, I know exactly which .ejs file to look at. I don't need to go through whole server.js code to find a missing part or a broken quote.

**Postman Collection Reflection**
• What is the purpose of a Postman Collection?
It serves as a documented, repeatable test for my API, allowing me to organize various request types GET, POST, and verify that my routes, parameters, and form validation work as expected.
• Which route in your app uses req.params?
The /data/:id route  to fetch a specific record by its rank.
• Which route in your app uses req.query?
The search?keyword=and filter?category= routes to handle search terms and category filtering.
• Which route receives POST form data?
The /add-game route receives POST data, which is parsed by express.urlencoded middleware.
• What valid POST data did you test?
 name:  Test , genre: Action, year: 2026, platform: PC
• What invalid POST data did you test?
 name:  , genre: Action, year: 99999, platform: PC
• What validation error did your app return?
It returned a 400 Bad Request status and a list of specific error messages.
• How could this collection help another developer understand your API?
It provides a guide shows which endpoints exist, the required fields for inputs, and the expected error responses, allowing them to test the API  without reading through all the source code.