const fastify = require('fastify')({ logger: true })
const startDB = require('./helpers/DB');
const userRoutes = require('./routes/user')
fastify.register(startDB);

userRoutes.forEach((route)=>{
fastify.route(route);
})
fastify.listen({ port: 3002 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})