import { __dirname } from './utils.js'
import { Server } from "socket.io"
import express from 'express'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import passport from 'passport'
import config from './config.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import './dal/db/dbConfig.js'
import './passport/passportStrategies.js'

//routers
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import productsViewRouter from './routes/productsView.router.js'
import viewsRouter from './routes/views.router.js'
import cartViewRouter from './routes/cartView.router.js'
import usersRouter from './routes/users.router.js'
import chatRouter from './routes/chat.router.js'
import mockRouter from './routes/mock.router.js'
import loggerRouter from './routes/loggerTest.router.js'


export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//__dirname
app.use(express.static(__dirname + '/public', {
  mimeTypes: {
    '/js/index.js': 'application/javascript'
  }
}));

//handlebars setting
app.engine('handlebars', handlebars.engine({
  helpers: {
    isEqual: function(a, b, opts) {
      return a === b ? opts.fn(this) : opts.inverse(this)
    },
    areEqual: function(a, b, c, opts) {
      return c === a || c === b ? opts.fn(this) : opts.inverse(this)
    },
    exists: function(a, opts) {
      return a ? opts.fn(this) : opts.inverse(this)
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


//cookies
app.use(cookieParser(config.SECRET_COOKIES))

//sessions Mongo
const connection = mongoose.connect(config.MONGO_URL)

const filestore = FileStore(session)

app.use(
  session({
    store: new MongoStore({
      mongoUrl: config.MONGO_URL,
      ttl: 3600
    }),
    secret: config.SECRET_MONGO,
    resave: false,
    saveUninitialized: false
  }))

//swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "BackCoder Documentation",
      description: "BackCoder API Rest"
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
}

const specs = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//passport
app.use(passport.initialize()) //inicializa passport
app.use(passport.session()) // trabaja con sessions

// routes
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)
app.use("/mockingproducts", mockRouter)

// handlebars routes
app.use("/api/views", viewsRouter)
app.use("/api/users", usersRouter)
app.use("/carts", cartViewRouter)
app.use("/products", productsViewRouter)
app.use("/chat", chatRouter)
app.use("/loggerTest", loggerRouter)

const PORT = config.PORT

// listen requests on PORT = 8080
const httpServer = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})

export const socketServer = new Server(httpServer)
