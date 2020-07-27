const orderType = (sequelize, DataTypes) => {
  const {UUIDV4, STRING, UUID} = DataTypes
  const OrderType = sequelize.define('orderType', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: STRING,
      validate: { notEmpty: true },
    },
    // createdBy: {
    //   type: UUID,
    //   validate: { notEmpty: true },
    // },
  });

  // OrderType.associate = models => {
  //   OrderType.belongsTo(models.User);
  // };

  return OrderType;
};

export default orderType;
