'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { UUIDV4, STRING, UUID, BOOLEAN } = Sequelize
    await queryInterface.createTable('users', {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      userName: {
        type: STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: STRING,
      },
      authId: {
        type: STRING,
        unique: true,
        allowNull: true,
      },
      role: {
        type: STRING,
      },
      otp: {
        type: STRING,
      },
      image: {
        type: STRING,
      },
      isVerified: {
        type: BOOLEAN,
      },
      isLogin: {
        type: BOOLEAN,
      },
      authType: {
        type: STRING,
      },
      title: {
        type: STRING,
      },
      aboutService: {
        type: STRING,
        validate: {
          len: [10, 200],
        }
      },
      aboutMe: {
        type: STRING,
        validate: {
          len: [10, 200],
        }
      },
      isOnline: {
        type: BOOLEAN,
      },
      isAdvisor: {
        type: BOOLEAN,
      },
      // categories: {
      //   type: STRING,
      // },
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
    await queryInterface.createTable('categories', {
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
      }
    });
    await queryInterface.createTable('userCategories', {
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
      categoryId: {
        type: UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      categoryName: {
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
    await queryInterface.createTable('favourites', {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },

      advisorName: {
        type: STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      advisorId: {
        type: UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
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
    await queryInterface.createTable('reviews', {
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
      advisorName: {
        type: STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      advisorId: {
        type: UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      reviewType: {
        type: BOOLEAN
      },
      ReviewText: {
        type: STRING,
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
      }
    });
    await queryInterface.createTable('messages', {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      text: {
        type: STRING,
        validate: { notEmpty: true },
      },
      userId: {
        type: UUID,
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
    await queryInterface.dropTable('user');
  }
};
