const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcryptConfig = require('../config/bcrypt.config');


const UserService = require('../services/user.service');

passport.use('local', new LocalStrategy(
    {
        usernameField: 'login',
        passwordField: 'password',
        session: false
    }, (username, password, done) => {
        const credentials = {
            login: username,
            password
        };

        UserService.getByLogin(credentials.login)
            .then(async (user) => {
                const isSamePassword = await bcryptConfig.compare(credentials.password, user.password);
                if (isSamePassword) {
                    done(null, user);
                }
                done(null, false, 'Bad credentials');
            })
            .catch(() => done(null, false, 'Bad credentials'));
    }
));

module.exports = passport;
