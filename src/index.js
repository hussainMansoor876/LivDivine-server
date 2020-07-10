import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import loaders from './loaders';

const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';
const app = express();

// app.use(cors());
app.use(cors('*'));

app.get('/confirmation/:token', async (req, res) => {
  // try {
    const { user: { id } } = jwt.verify(req.params.token, EMAIL_SECRET);
    console.log('req.params.token', req.params.token)
    console.log('EMAIL_SECRET', EMAIL_SECRET)      
    console.log('id', id)
    const users = await models.User.findByPk(id)
    console.log('user', users)
    if (users) {
      await models.User.update({ isVerified: true }, { where: { id } });
      
    } else {
      console.log('error')
    }
  // } catch (e) {
  //   res.send('error');
  //   // return
  // }

  return res.redirect('https://www.google.com');
});

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;

sequelize.sync({
  force: isTest || isProduction,
  sync: true
}).then(async () => {
  const user = await models.User.findAll({
    where: {
      email: "hello@robin.com",
    },
  });

  // console.log("asdasdsaddddddddddddddddddddd",user);
  if ((isTest || isProduction) && user.length <= 0) {
    createUsersWithMessages(new Date());
  }


});
httpServer.listen({ port }, () => {
  console.log(`Apollo Server on http://localhost:${port}/graphql`);
});
const createUsersWithMessages = async date => {

  await models.User.create(
    {
      userName: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      isVerified: true,
      isLogin: false,
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      userName: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      isVerified: true,
      isLogin: false,      
      role: "USER",
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
  console.log('asdasdasd')
};
