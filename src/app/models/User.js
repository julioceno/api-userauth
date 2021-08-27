const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");

class User extends Model { 
    static init(connection) { 
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            password_reset_token: DataTypes.STRING,
            password_reset_expires: DataTypes.DATE,
        }, {
            sequelize: connection,
            hooks: {
                beforeCreate: async (user, options) => {
                    user.id = uuid()
                },

                beforeSave: async (user, options) => {
                    const hash = await bcrypt.hash(user.password, 10)
                    user.password = hash;
                },
            }
        });
    };
};


module.exports = User;