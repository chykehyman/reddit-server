import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import dotenv from 'dotenv';

import { PROD_ENV } from './constants';
import { Post } from './entities/Post';
import { PostResolver } from './resolvers/Post';

dotenv.config()

const main = async () => {
   const orm = await MikroORM.init({
    entities: [Post],
    dbName: 'reddit',
    type: 'mongo',
    debug: !PROD_ENV,
    clientUrl: process.env.MONGODB_URL
   })

  const app = express()
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em })
})

  apolloServer.applyMiddleware({ app })
  
  app.listen(4000, () => console.log('Server started on port:4000'))
}

main().catch(err => console.error(err.message))

