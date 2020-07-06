const review = (sequelize, DataTypes) => {
  const {UUIDV4, STRING, UUID, BOOLEAN} = DataTypes
  const Review = sequelize.define('review', {
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
    // userId: {
    //   type: UUIDV4,
    //   // unique: true,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
    advisorName: {
      type: STRING,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    advisorId: {
      type: UUID,
      // unique: true,
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
  });

  Review.associate = models => {
    Review.belongsTo(models.User);
  };

  return Review;
};

export default review;
