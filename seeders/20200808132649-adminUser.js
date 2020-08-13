'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const uuidv4 = require('uuid/v4');
    return queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      userName: 'admin',
      email: 'admin@gmail.com',
      password: '$2a$10$X4WUW1Er.Yl4o.j3XuNlge6xLlx.DEuDdsykRU9D769FP0PURBNhm',
      role: 'ADMIN',
      isVerified: 'true',
      isLogin: 'false',
      isOnline: 'false',
      isAdvisor: 'false',
      isApproved: 'false',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    // return queryInterface.sequelize.query(
    //   `DO
    //   $do$
    //   BEGIN

    //   IF NOT EXISTS (SELECT 1 FROM "users" where "email" = 'admin@gmail.com') THEN
    //      INSERT INTO "users" (id, "userName", "email", "password", "role", "isVerified", "isLogin", "isOnline", "isAdvisor", "isApproved") 
    //      VALUES (Default,'admin', 'admin@gmail.com', '$2a$10$X4WUW1Er.Yl4o.j3XuNlge6xLlx.DEuDdsykRU9D769FP0PURBNhm',"ADMIN", true, 'false', 'false', false, false);
    //   END IF;

    //   END
    //   $do$`
    // );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
