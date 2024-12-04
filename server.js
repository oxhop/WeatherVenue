import { config as dotenv } from 'dotenv'
import * as Eta from 'eta'
import fastify_ from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url'
import { options } from './libs/options/_options_.js'
import config from './config/configuration.js'
import isSpam from './libs/decorators/spam.js'
import routes from './libs/routes/routes.js'
import GracefulServer from '@gquittet/graceful-server'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyRedis from '@fastify/redis'
import fastifyStatic from '@fastify/static'
import viewsPlugin from '@fastify/view'

const { helmet, logger } = options

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv()

const fastify = fastify_({
  logger: logger(),
  disableRequestLogging: true,
  keepAliveTimeout: 10000,
  requestTimeout: 5000,
})
const gracefulServer = GracefulServer(fastify.server)
// TODO: manage open resources
gracefulServer.on(GracefulServer.READY, () => {
  fastify.log.info('Server is ready')
  console.log('Server is ready')
})
gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  fastify.log.error('Server is shutting down')
  console.error('Server is shutting down')
})
gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
  fastify.log.error('Server is down because of', error)
  console.error('Server is down because of', error)
})
// SERVE STATIC CONTENT
fastify.register(fastifyStatic, { root: path.join(__dirname, 'public') })

fastify.register(fastifyHelmet, helmet)
fastify.register(fastifyRedis, { host: config('REDIS_HOST'), port: 6379/*, password: config('PASSWORD')*/ })
// flash is useful for redirects but requires a session
// fastify.register(fastifyFlash)

/*********************************************************************************************** */
// TODO: find a way to strip very long eta logging errors
fastify.register(viewsPlugin, {
  engine: {
    eta: Eta,
  },
  root: path.join(__dirname, 'templates'),
  options: { useWith: true },
})

/*********************************************************************************************** */
// !!SPAM ASSASSIN !!
fastify.register(fastifyRateLimit, config('PING_LIMITER'))
fastify.addHook('onRequest', isSpam)
fastify.register(routes)

const start = async () => {
  try {
    const port = process.env.PORT || config('NODE_PORT')
    console.log('The app is accessible on port: ' + port)
    await fastify.listen({ port, host: '0.0.0.0' })
    gracefulServer.setReady()
  } catch (err) {
    console.log(err)
    fastify.log.error(err)
    process.exit(1)
  }
}
await start()
