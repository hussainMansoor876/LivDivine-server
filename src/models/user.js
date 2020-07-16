import bcrypt from 'bcryptjs';

const user = (sequelize, DataTypes) => {
  const {UUIDV4, STRING, UUID, BOOLEAN} = DataTypes
  const User = sequelize.define('user', {
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
    email: {
      type: STRING,
      unique: true,
      allowNull: true,
      // validate: {
      //   notEmpty: true,
      //   isEmail: true,
      // },
    },
    password: {
      type: STRING,
    },
    authId: {      
      type: STRING,
      unique: true,
      allowNull: true,
    },
    role: {
      type: STRING,
    },
    otp: {
      type: STRING,
    },
    image: {
      type: STRING,
    },
    isVerified: {
      type: BOOLEAN,
    },
    isLogin: {
      type: BOOLEAN,
    },
    authType: {
      type: STRING,
    },
    title: {
      type: STRING,
    },
    aboutService: {
      type: STRING,
      validate: {
        len: [10, 200],
      }
    },
    aboutMe: {
      type: STRING,
      validate: {
        len: [10, 200],
      }
    },
    isOnline: {      
      type: BOOLEAN,
    },
    isAdvisor: {      
      type: BOOLEAN,
    },
    // categories: {      
    //   type: STRING,
    // }
  });


  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
    User.hasMany(models.Favourite, { onDelete: 'CASCADE' });
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
