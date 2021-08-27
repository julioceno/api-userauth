const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");

class User extends Model { 
    static init(connection) { 
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING
        }, {
            sequelize: connection,
            hooks: {
                beforeCreate: async (user, options) => {
                    const hash = await bcrypt.hash(user.password, 10)
                    user.password = hash;

                    user.id = uuid()
                }
            }
        });
    };
};


module.exports = User;