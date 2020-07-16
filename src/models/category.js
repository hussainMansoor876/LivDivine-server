const category = (sequelize, DataTypes) => {
  const {UUIDV4, STRING, UUID} = DataTypes
  const Category = sequelize.define('category', {
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
  });

  // Category.associate = models => {
  //   Category.belongsTo(models.User);
  // };

  return Category;
};

export default category;
