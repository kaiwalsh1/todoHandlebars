const {
    User
} = require('../models');

module.exports = {
    createUser: async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'You must provide username, email and password'});
        }
        // attempt to create user 
        try {
            const user = await User.create({
                username,
                email,
                password,
            });
            res.json(user);
        } catch (e) {
            res.json(e);
        }
    },
// getting users
    getAllUsers: async (req, res) => {
        // req.session.destroy(() => {
        // })
        req.session.save(() => {
            if (req.session.visitCount) {
                req.session.visitCount++;
            } else {
                req.session.visitCount = 1;
            }
        });

        try {
            const usersData = await User.findAll({});

            const users = usersData.map(user => user.get({ plain: true }));

            res.render('allUsers', {
                users,
                favoriteFood: 'Ice cream sandwich',
                visitCount: req.session.visitCount,
                loggedInUser: req.session.user || null,
            });
        } catch (e) {
            res.json(e);
        }
    },

    getUserById: async (req, res) => {
        req.session.save(() => {
            if (req.session.visitCount) {
                req.session.visitCount++;
            } else {
                req.session.visitCount = 1;
            }
        });
        try {
            const userData = await User.findByPk(req.params.userId);
            const user = userData.get({ plain:true });
// tell node we want to render singleUser template
            res.render('singleUser', {
                user,
                visitCount: req.session.visitCount,
            });
        } catch (e) {
            res.json(e);
        }
    },
    login: async (req, res) => {
        // validation that it's an email and password
        try {
            // first find the user with the given email address
            const userData = await User.findOne({ email: req.body.email });
            const userFound = userData.get({ plain: true });

            console.log(userFound);
            console.log(userFound.password, 80);
            console.log(req.body.password, 81);
            // check if the pw from the form is the same password as the user found
            //      with the given email
            // if that is true, save the user found in req.session.user
            if (userFound.password === req.body.password) {
                console.log('im hit');
                req.session.save(() => {
                    req.session.user = userFound;
                    res.json({ success: true });
                });
            }
            // if false, ignore it for now
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
};