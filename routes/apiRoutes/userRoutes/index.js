const router = require('express').Router();
const {
    createUser,
    getAllUsers,
    getUserById,
} = require('../../../controllers/userController');

// route - /api/users
router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:userId')
    .get(getUserById);

// /api/users/:userId
// router.route('/')
//     .delete(deleteUserById)
//     .get(getUserById)
//     .put(updateUserById)

module.exports = router;