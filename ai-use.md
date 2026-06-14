1.Which GenAI tool did you use?
I used Gemini
2.What did you ask it to help with?
Debugging, checking the logic correct and configuring EJS view engine settings,
3.Which suggestions did you accept, reject, or modify?
Accepted: I accepted the suggestions regarding the use of express.static and the pathing fix (/style.css instead of ../public/style.css), which resolved my UI rendering issues. 
Rejected: I did not reject architectural suggestions, but I modified the provided code to specifically match my Video Game Sales dataset 
4.What did you learn from it?
I learned that in Express, express.static maps files to the root directory, which is why absolute paths (/) are safer than relative paths (../). I also learned how to better structure my API documentation by using variable-based URLs in Postman.
5.Which part of the final solution is clearly customized to your own
dataset?
The main data routes are fully customized, find method logic for the :id route, the filter logic for Genre, and the EJS template structure in views/table.ejs, which displays my specific Rank, Name, and Global_Sales fields.
6.What part of the code can you confidently explain without help?
I can confidently explain the entire routing structure, including how req.params and req.query work to fetch specific data, the logic behind the POST form validation (checking for empty fields), and how the EJS template loops through the dataset to generate the table dynamically.