'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, FLOAT } = Sequelize
    await queryInterface.removeColumn('userCategories', 'categoryId');
    await queryInterface.removeColumn('userOrderTypes', 'orderTypeId');
    await queryInterface.addColumn(
      'userOrderTypes',
      'subTitle',
      {
        type: STRING,
      }
    );
    await queryInterface.addColumn(
      'userOrderTypes',
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
