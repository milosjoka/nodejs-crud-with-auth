const db = require('../models');
const User = db.userModel;
const Group = db.groupModel;
const  Op  = db.Sequelize.Op;

const fieldsToExcludeFromUpdateAndCreate = ['is_deleted'];

function getFieldsForUpdateAndCreate() {
    return Object.keys(User.rawAttributes).filter(s => !fieldsToExcludeFromUpdateAndCreate.includes(s));
}

exports.getAutoSuggested = async (loginSubstring, limit) => {
    const condition = {
        where: {
            login: { [Op.iLike]: `%${loginSubstring}%` }
        },
        limit,
        order: [
            ['login', 'ASC']
        ],
        include: [
            {
                model: Group,
                as: 'groups',
                attributes: ['id', 'name', 'permissions'],
                through: {
                    attributes: []
                }
            }
        ]
    };

    return await User.findAll(condition);
};


exports.getById = (id) => {
    return User.findByPk(id, {
        include: {
            model: Group,
            as: 'groups',
            attributes: ['id', 'name', 'permissions'],
            through: {
                attributes: []
            }
        }
    });
};

exports.create = async (user) => {
    return await User.create(user);
};

exports.update = async (id, user) => {
    return await User.update(
        user, {
            where: { id },
            fields: getFieldsForUpdateAndCreate()
        }
    );
};

exports.delete = async (id) => {
    return await User.destroy(
        {
            where: { id }
        }
    );
};

exports.getByLogin = async (login) => {
    const condition = {
        where: {
            login: { [Op.eq]: login }
        }
    };

    return await User.findOne(condition);
};
