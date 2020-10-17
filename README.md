# Chat SPA
## Goals and Requirements

Built a multi-user chat application built with webpack
- that works as a SPA (only a single page load in the browser)
- that requires a login (no password, but username "dog" is not allowed)
- that has RESTful services and makes async calls to perform:
  - Login
  - Logout
  - getting the list of messages
  - getting the list of logged in users
  - sending a new message
- The RESTful services will send and receive JSON-formatted data
- that uses a cookie to store a uid (holding a uuid) to track if a user is logged in
- that checks the cookie on every service call
- that polls for new messages while user is logged in

### Program Structure

- Used a node express server for the RESTful services
- Serve a single static HTML file for the index.html
- Serve a static CSS file(s) for styling
- Serve a single static client-side JS file that is built with webpack and babel
- Client-side JS will be built from multiple files using ES6 import syntax
- Service-side JS will be used without webpack/babel and will use node require() syntax
- Both client-side and server-side JS will use separation of concerns with multiple files
- We can download your repo, run `npm install`, `npm run build`, and `npm run start` to use your program
- When your program starts it will console.log() a localhost url including port to see your SPA in the browser

### Authentication

- The user is unable to see messages unless they are authenticated (logged in)
- When the user logs in, they must provide a username
- A username of "dog" is denied access
- On login a username is added to a list of current users
- On login a `uid` cookie is set
- The uid cookie will be set to a uuid using the `uuidv4` npm module
- On logout that uid is considered logged out
- If the same username logs in from multiple browsers
  - The username is listed multiple times in the "current users" list
  - If one of those users logs out, the others of the same name are not
- When a user provides a valid username, the page will show the list of messages and current users
- Any service call without a valid uid cookie will return an appropriate error and the page will require the user to login
- If the user logs out they return to the login screen

### User list

- The currently logged in list of users is displayed
- This list will update periodically (see Polling)
- This list will be scrollable if the list is too large for the window

### Reading Messages

- All messages will have a date/time stamp
- ...That is not ugly
- All messages will show the username that posted them
- Messages will be in sequential order
- This list will be scrollable if the list is too large for the window
- This list will periodically update (see Polling)

### Posting Messages

- A user can send a message by sending the text to a RESTful service
- The service will add the date/time data and the username to the message
- The page will show the updated list of messages
- The service will respond with appropriate errors if an empty message is sent to it
- The page will display errors if the service rejects the message

### Polling

- Every few seconds (you pick the exact value) the SPA will request the list of messages and users from services
- Yes, this isn't the most efficient ( long-polling or websockets are more efficient)
- If these services return errors about authentication, see Authentication
- If these services fail to connect or have other errors, an appropriate message will display to the user
- If the user is not logged in (initial load or logout) this polling will not happen

## Allowances

- You are free to reuse CSS or code from previous work, but the requirements and expectations are now higher
- You can structure your HTML and CSS as you like, so long as it 
  - meets the display requirements
  - works for reasonable desktop browser sizes
  - is valid HTML/CSS (note "it works" is different than "is valid")
  - follows basic semantic principles

## Limitations

- used these packages only, otherwise no external JS
  - `express`
  - `cookie-parser`
  - the babel and webpack-related packages
    - `@babel/core` and `@babel/preset-env`
    - `webpack` and `webpack-cli`
    - `babel-loader`
  - `uuid`
- Did not store your application state in your DOM, nor read it from the DOM
- only made visual changes via:
  - Applying/removing a class
  - add/removing HTML
  - changing a `disabled` property
- did not use HTTP redirects or JS-based page-load redirects
- did not use localStorage/sessionStorage/IndexedDB 
- did not use cookies other than the uid
- did not use Map() or Set()
- did not use async/await
- did not use var or alert()
- Followed the best practices from class for JS, CSS, HTML
- Did NOT interact with the browser url, including hash fragment
- Did NOT include files in your PR that are outside the assignment (no IDE configs, `node_modules/`, etc)
* Did not use external CSS libraries

