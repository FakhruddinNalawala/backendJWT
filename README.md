# backendJWT
## For Vumonic

## An app backend in Node.js, Express.js and Mongoose to create a JWT-based article posting system.

## Task:

## I (a). Task

1. Create a JWT based Authentication system.<br>
  a. Normal Users can sign up using Name, Email and Password. <br>
  b. On sign in, create a JWT and return in response. <br>
  c. Create Admin Users. <br>
2. Create an API to create a Topic (Name, Image) (Only Admin)
3. Create an API to create Articles for a Topic (Title, Image, Content, isFeatured) (Only Admin)
4. Create an API to update Articles (Only Admin)
5. Create APIs to fetch all Topics, fetch a Topic by Id. (All Users can do) 6. Create APIs fetch all Articles for a Topic, fetch Article by Id. <br>
  a. Only Logged in Users can see the Articles which are featured. <br>
  b. Non logged in Users can see Articles other than Featured Articles. <br>
  c. Everytime an Article is fetched, increase and record the count along with Article details. <br>

# I (b). Task - Continuation of 1(a)

7. Create option to associate tags with Articles
8. When an Article is fetched, fetch related Articles also based on matching tags 
9. Make an option to change the order in which the article appears on get api results.
10. The JWT token should expire in 5 minutes. After that all requests with that token should respond accordingly

# II. Task

## Algorithm Based Task

1. Create a binary tree representation of the Articles based on the count. 
2. When an article is deleted, update the tree representation.



# Future Updates:

1. Hash Password instead of storing directly
2. Add delete
3. Add Validation
4. Add test cases in Mocha(?)
