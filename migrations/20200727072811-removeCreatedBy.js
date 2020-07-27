'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('categories', 'createdBy');
    await queryInterface.removeColumn('orderTypes', 'createdBy');
  },

  down: async (queryInterface, Sequelize) => {

  }
};
