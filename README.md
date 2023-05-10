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

8. The catchAsync function takes a single argument, myFunc, which is of type T. The T type parameter is a generic type that extends a function that takes any number of arguments and returns a Promise that resolves to any value. The use of a generic type here allows you to specify the function signature of myFunc dynamically, based on the type of function that is passed in.

The catchAsync function returns a new function that takes three arguments: req, resp, and next, which are objects representing an HTTP request, response, and next middleware function, respectively. This returned function then calls myFunc with these three arguments and returns the resulting Promise.

If the Promise returned by myFunc is rejected, the catch method is called with next as its argument. next is a function that invokes the next middleware function in the application's middleware stack. By passing next to catch, any errors thrown in the Promise chain will be passed down to the error-handling middleware, allowing for centralized error handling.

In summary, the catchAsync function is a utility function that takes a function that returns a Promise and returns a new function that handles errors in that Promise by passing them down to the error-handling middleware.

7. The method first uses the crypto module, which is a built-in Node.js module that provides cryptographic functionality, to generate a random sequence of bytes using the randomBytes() function. The argument 32 specifies the number of bytes to generate, which is then converted to a hexadecimal string using the toString() method.

The next line creates a hash of the resetToken using the SHA-256 algorithm by calling crypto.createHash("sha256").update(resetToken).digest("hex"). The createHash() method creates a hash object using the specified algorithm, which is then updated with the resetToken string using the update() method, and finally, the digest() method is called with "hex" as an argument to return the hash value as a hexadecimal string.