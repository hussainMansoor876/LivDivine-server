const favourite = (sequelize, DataTypes) => {
  const {UUIDV4, STRING, UUID} = DataTypes
  const Favourite = sequelize.define('favourite', {
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
    userName: {
      type: STRING,
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
