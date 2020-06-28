import bcrypt from 'bcryptjs';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    userName: {
      type: DataTypes.STRING,
      unique: true,
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
    optp: {
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

  });


  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
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
    if(pass){
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
