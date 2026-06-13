困難 理解程式 不知道轉換新的json檔案是怎麼運作的 按照步驟也有點不知道是怎麼進行
用了express-validator而不是提到的validateAddForm



**Step1 Check point**
Explain the command you used to run add-images.js. What are the input file, output file, category-like field, and title/name field in your command? Also explain what would happen if your dataset does not have the field name you passed as categoryField.

**Step3 Check point**
Visit /data, /table, and submit your /add form. Copy three logger outputs from your terminal and explain what each line tells you about the reques
[6/13/2026, 2:02:49 PM] GET /data
This indicates that the client made a GET request to retrieve the JSON dataset from the /data route.
[6/13/2026, 2:03:08 PM] GET /table
This shows a GET request to the /games route, which means the user navigated to the page that displays the EJS HTML table of the video games dataset.
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