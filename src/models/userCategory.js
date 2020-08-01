const userCategory = (sequelize, DataTypes) => {
  const {UUIDV4, STRING, UUID, BOOLEAN} = DataTypes
  const UserCategory = sequelize.define('userCategory', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    userName: {
      type: STRING,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    categoryName: {
      type: STRING,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  UserCategory.associate = models => {
    UserCategory.belongsTo(models.User);
    // UserCategory.belongsTo(models.Category);
  };

  return UserCategory;
};

export default userCategory;
