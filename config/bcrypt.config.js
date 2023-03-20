const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.hash = async (string) => {
    return await bcrypt.hash(string, saltRounds);
};


module.exports.compare = async (string, hash) => {
    return await bcrypt.compare(string, hash);
};
