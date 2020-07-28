'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, FLOAT } = Sequelize
    await queryInterface.addColumn(
      'orderTypes',
      'subTitle',
      {
        type: STRING,
      }
    );
    await queryInterface.addColumn(
      'orderTypes',
      'price',
      {
        type: FLOAT,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
