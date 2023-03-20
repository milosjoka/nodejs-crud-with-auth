const dbConfig = require('../config/db.config');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.userModel = require('./user.model')(sequelize, DataTypes);
db.groupModel = require('./group.model')(sequelize, DataTypes);

db.userModel.belongsToMany(db.groupModel, {
    through: 'user_group',
    as: 'groups',
    foreignKey: 'user_id',
    otherKey: 'group_id',
    timestamps: false
});

db.groupModel.belongsToMany(db.userModel, {
    through: 'user_group',
    as: 'users',
    foreignKey: 'group_id',
    otherKey: 'user_id',
    timestamps: false
});

module.exports = db;
