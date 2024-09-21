const express = require('express');
const { createUser, getAllUsers, Delete, loginUser, updateTasks, addTasks, searchUser } = require('../controllers/userControls');
const router = express.Router();

router.get('/signup', getAllUsers)

router.post('/signup', createUser)

router.delete('/signup/:id', Delete)


router.get('/login')

router.post('/login', loginUser)



router.put('/update/tasks/:token', addTasks)


module.exports= router;