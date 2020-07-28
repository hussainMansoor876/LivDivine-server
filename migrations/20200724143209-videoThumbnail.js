'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize
    await queryInterface.addColumn(
      'users',
      'videoThumbnail',
      {
        type: STRING,
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
