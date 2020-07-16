const Sequelize = require("sequelize");
const sequelize = require("sequelize");

sequelize : new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: 'postgres',
      port: 5000,
      host: "localhost",
    },
  );

  module.exports = sequelize;
  global.sequelize = sequelize;
// require('ts-node/register');

// const config = require('../src/config/index.ts').default;

// module.exports = {
//     isTest: {
//         host: 'localhost',
//         port: 5000,
//         username: 'postgres',
//         password: 'Sseasol@)!(2020',
//         database: 'testOcean',
//         dialect: 'postgres',
//         dialectOptions: {
//             ssl: false
//         },
//         operatorsAliases: false
//     },
//     development: {
//         host: 'localhost',
//         port: 5000,
//         username: 'postgres',
//         password: 'Sseasol@)!(2020',
//         database: 'testOcean',
//         dialect: 'postgres',
//         dialectOptions: {
//             ssl: false
//         },
//         operatorsAliases: false
//     },
//     live_old: {
//         host: 'ec2-54-235-208-103.compute-1.amazonaws.com',
//         port: 5432,
//         username: 'hmszolrlciatrx',
//         password: '7992419508a7ff36765bf7addc0e07fdb11b90b85b68372f024bfd9fa87b5a61',
//         database: 'dfps9d3tkcn7ua',
//         dialect: 'postgres',
//         dialectOptions: {
//             ssl: true
//         },
//         operatorsAliases: false
//     },
//     live: {
//         host: '185.67.0.30',
//         port: 5432,
//         username: 'postgres',
//         password: 'PpWXdf7aTC97nz6h',
//         database: 'aetasaal',
//         dialect: 'postgres',
//         dialectOptions: {
//             ssl: false
//         },
//         operatorsAliases: false
//     }
// };