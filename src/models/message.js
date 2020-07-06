const message = (sequelize, DataTypes) => {
  const {UUIDV4, STRING, UUID} = DataTypes
  const Message = sequelize.define('message', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    text: {
      type: STRING,
      validate: { notEmpty: true },
    },
  });

  Message.associate = models => {
    Message.belongsTo(models.User);
  };

  return Message;
};

export default message;
