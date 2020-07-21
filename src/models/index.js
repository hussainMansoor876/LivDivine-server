import Sequelize from 'sequelize';

let sequelize;
if (process.env.DATABASE_URL) {
  console.log('this')
  sequelize = new Sequelize(
    process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
} else {

  console.log('process.env.TEST_DATABASE',process.env.TEST_DATABASE )
  console.log('process.env.DATABASE',process.env.DATABASE )
  sequelize = new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: 'postgres',
      port: 5000
    },
  );
}

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message'),
  Review: sequelize.import('./review'),
  Favourite: sequelize.import('./favourite'),
  Category: sequelize.import('./category'),
  UserCategory: sequelize.import('./userCategory'),
  OrderType: sequelize.import('./orderType'),
  UserOrderType: sequelize.import('./userOrderType'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
