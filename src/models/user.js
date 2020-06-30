import bcrypt from 'bcryptjs';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
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
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
    },
    isLogin: {
      type: DataTypes.BOOLEAN,
    },
    authType: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    advisorImage: {
      type: DataTypes.STRING,
    },
    aboutService: {
      type: DataTypes.STRING,
      validate: {
        len: [100, 200],
      }
    },
    aboutMe: {
      type: DataTypes.STRING,
      validate: {
        len: [50, 200],
      }
    },
    categories: {      
      type: DataTypes.STRING,
    }
  });


  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
    // User.hasMany(models.Review, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { userName: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  User.beforeCreate(async user => {
    const pass = await user.generatePasswordHash();
    if (pass) {
      user.password = pass
    }
  });

  User.prototype.generatePasswordHash = async function () {
    if (this.password) {
      const saltRounds = 10;
      return await bcrypt.hash(this.password, saltRounds);
    }
    return false
  };

  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;
