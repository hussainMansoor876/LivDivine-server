'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { UUIDV4, STRING, UUID, BOOLEAN } = Sequelize
    await queryInterface.addColumn(
      'users',
      'isApproved',
      {
        type: BOOLEAN,
      }
    );
    await queryInterface.createTable('orderTypes', {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      name: {
        type: STRING,
        validate: { notEmpty: true },
      },
      createdBy: {
        type: UUID,
        validate: { notEmpty: true },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
    await queryInterface.createTable('userOrderTypes', {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      userName: {
        type: STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      orderTypeId: {
        type: UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      orderTypeName: {
        type: STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {

  }
};
