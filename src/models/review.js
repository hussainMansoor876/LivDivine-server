const review = (sequelize, DataTypes) => {
  const Review = sequelize.define('review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // userId: {
    //   type: DataTypes.UUIDV4,
    //   // unique: true,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
    advisorName: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // advisorId: {
    //   type: DataTypes.UUIDV4,
    //   // unique: true,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
    reviewType: {
      type: DataTypes.BOOLEAN
    },
    ReviewText: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
    },
  });

  Review.associate = models => {
    Review.belongsTo(models.User);
  };

  return Review;
};

export default review;
