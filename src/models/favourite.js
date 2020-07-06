const favourite = (sequelize, DataTypes) => {
  const Favourite = sequelize.define('favourite', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    advisorName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    advisorId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userName: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Favourite.associate = models => {
    Favourite.belongsTo(models.User);
  };

  return Favourite;
};

export default favourite;
