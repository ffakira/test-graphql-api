require('dotenv').config()
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import cors from 'cors'
import { ONE_DAY } from './utils'
import router from './router'
import PgStore from './utils/store'
const app = express()
const { NODE_ENV } = process.env

const secure = NODE_ENV === 'development' || NODE_ENV === 'test' ? false : true
app.use(
  session({
    store: new PgStore(),
    name: process.env.COOKIE_NAME,
    secret: process.env.COOKIE_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      secure,
      maxAge: ONE_DAY,
      httpOnly: true
    }
  })
)

/** @dev addtional middlewares */
const morganEnv = NODE_ENV === 'development' ? 'dev' : 'combined'
app.use(morgan(morganEnv))

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: 'GET, POST, PATCH, DELETE'
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** @dev registerRoutes */
router(app)

export default app