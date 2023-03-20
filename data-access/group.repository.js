const db = require('../models');
const Group = db.groupModel;
const User = db.userModel;
const sequelize = db.sequelize;

exports.getAll = async () => Group.findAll({
    include: [
        {
            model: User,
            as: 'users',
            attributes: ['id', 'login', 'age'],
            through: {
                attributes: []
            }
        }
    ]
});

exports.getById = (id) => Group.findByPk(id, {
    include: [
        {
            model: User,
            as: 'users',
            attributes: ['id', 'login', 'age'],
            through: {
                attributes: []
            }
        }
    ]
});

exports.create =  (group) => Group.create(group);

exports.update = async (id, group) => {
    return await Group.update(
        group, {
            where: { id }
        }
    );
};

exports.addUsersToGroup = async (id, userIds) => {
    await sequelize.transaction(async (t) => {
        const group = await Group.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'login', 'age'],
                    through: {
                        attributes: []
                    }
                }
            ],
            transaction: t
        });

        await group.setUsers(userIds, { transaction: t });
        return group;
    });
};

exports.delete = async (id) => {
    return await Group.destroy(
        {
            where: { id }
        }
    );
};
