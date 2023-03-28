## Notes:

1. "__dirname" and "__filename" did'nt exist in ES6 modules. So, we use {dirname} from "path" module and {fileURLToPath} from "url" and "import.meta.url" to get the current directory name in which we are working.

2. "path.join()" is use always to give the path because in different operating systems path structure is different.

3. MongoDB is a popular open-source, document-oriented NoSQL database. It is designed to be scalable and flexible, allowing developers to store and manipulate data in a variety of formats without having to define a strict schema upfront.

MongoDB stores data as flexible, JSON-like documents, which can be nested and include arrays and other complex data structures. This makes it well-suited for use cases where data is not well-structured or may change frequently, such as in web applications that handle user-generated content.

4. Mongoose is a popular Object Data Modeling (ODM) library for Node.js and MongoDB. It provides a straightforward and schema-based solution to model data and interact with MongoDB databases.

Mongoose allows developers to define schemas for their data models, including data types and validation rules. It also provides a rich API for querying and modifying data, including support for populating related data, middleware hooks, and more.

5. The NFT.findByIdAndUpdate() method is used to find the NFT object in the database by its ID and update its properties with the data provided in the req.body object. The new option is set to true to return the updated NFT object, and runValidators is set to true to ensure that any updates conform to the schema defined for the NFT model.

6. By using the spread operator on req.query, this code creates a shallow copy of the req.query object, meaning it creates a new object with the same key-value pairs as req.query. This can be useful for manipulating the query parameters without modifying the original req.query object.

7. The regular expression /\b(gte|gt|lte|lt)\b/g is used to find and capture the keywords "gte", "gt", "lte", and "lt" in the JSON string. These keywords are commonly used as query parameters in MongoDB to specify greater-than, greater-than-or-equal-to, less-than, and less-than-or-equal-to conditions.

The replace() method is then used to replace each captured keyword with its MongoDB equivalent, which is the same keyword preceded by a "$" sign. The callback function takes the matched keyword as an argument and returns the modified string.