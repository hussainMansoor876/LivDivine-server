'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BOOLEAN } = Sequelize
    await queryInterface.addColumn(
      'userOrderTypes',
      'isActive',
      {
        type: BOOLEAN,
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
