# The Secrets App
Now share your secrets anonymously with everyone with our Secrets App

## Getting Started
- The App is currently hosted on Heroku. For a quick peek visit [Secrets]().
- To build this project locally, follow steps given below.

### Prerequisites
- Node, npm
- MongoDB Atlas account(free account works)
  - Visit [getting started guide](https://docs.atlas.mongodb.com/getting-started/) for steps of setting up your free cluster in the cloud.

### Installing
Clone this repository. 
```bash
$ git clone https://github.com/pratik-bongale/secrets-app.git 
```

Change directory
```bash
$ cd secrets-app
```

Install all dependencies
```
$ npm install
```

Rename ".env_sample" to ".env"
```
$ mv .env_sample .env
```

Modify ".env", replace the MongoDB connection string with your own generated in your MongoDB Atlas account.
```
MONGODB_CONN=mongodb+srv://username:password@cluster0-in9xt.mongodb.net/userDB
```

Run app locally
```
$ node app.js
```

### How to use
Home Page:
  - Register / Login: you need to register/login to post/submit your secret.
  - You can see all secrets submitted on the home page
  - Each user can submit one secret to the database
  - Even if you navigate away from the website, you will still be able to come back without the need to login again.

## Learnings
- This project demonstrates how to:
  - Authenticate users using PassportJs
  - Salt and Hash passowrds using passport-local-mongoose
  - Use session cookies to keep user logged in (using express-session package)
  - Connect to mongoDB database using mongoose.
  - Perform Create, Read, Delete operations on mongoDB collections
  - Export functions/variables from a module
  - Import functions/variables into a module
  - Use Embedded Javasciprt(EJS) to define views
  - Render EJS views using expresJS
  - Reuse EJS views(Header/Footer) across all pages for consistency
  - Handle get and post requests from the backend nodeJs script
  - Use route(url) parameters to display different content on a page based on url

## Authentication using PassportJS
- Personal notes:
  - PassportJS is used to authenticate users by storing session information and cookies. Example login app: https://mherman.org/blog/local-authentication-with-passport-and-express-4/
  - Pasport requires you to provide which strategy(ex. password or OAuth) should be used for authenticating your users. Ex. Local strategy is used to tell Passport that we want to use username/password based authentication Example: https://github.com/passport/express-4.x-local-example
  - express-session is used to configure sessions, it handles creating the session, setting the session cookie and creating the session object in req object.
  - You need to define auth strategy(local/OAuth), initialize middleware(express), create sessions(serialize/deserialize user info stored as cookies)
    1. require express-session, passport, passport-local [maintain order]
    2. set up in the same order as above
    3. assign passport-local-mongoose as a plugin to mongoose schema object, this gives you some very convinient methods to create user, save, and interact with mongoose
  - Make sure you read the docs of PLM carefully: https://github.com/saintedlama/passport-local-mongoose#api-documentation Example: https://github.com/saintedlama/passport-local-mongoose/tree/master/examples/login

## Author
- **Pratik Bongale** - *Initial work* - [Secrets App](https://github.com/pratik-bongale/secrets-app.git)


## Acknowledgments
- [The App Brewary](https://www.appbrewery.co/p/web-development-course-resources/)
- [The Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/)