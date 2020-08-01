
const userOrderType = (sequelize, DataTypes) => {
  const { UUIDV4, STRING, UUID, BOOLEAN, FLOAT } = DataTypes
  const UserOrderType = sequelize.define('userOrderType', {
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
    subTitle: {
      type: STRING,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: FLOAT,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // orderTypeId: {
    //   type: UUID,
    //   // unique: true,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
    orderTypeName: {
      type: STRING,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isActive: {
      type: BOOLEAN,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  UserOrderType.associate = models => {
    UserOrderType.belongsTo(models.User);
    // UserOrderType.belongsTo(models.OrderType);
  };

  return UserOrderType;
};

export default userOrderType;
