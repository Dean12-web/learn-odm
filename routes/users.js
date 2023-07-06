var express = require('express');
var router = express.Router();
const User = require('../models/User');
const { Response, secretKey, tokenValid } = require('../helpers/util');
const jwt = require('jsonwebtoken')


/* GET users listing. */

router.post('/auth', async function (req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.json(new Response('User not Found', false))

    if (!user.authenticate(password)) return res.json(new Response('Password Is Wrong', false))

    var token = jwt.sign({ user: user._id }, secretKey);
    res.json(new Response({ email: user.email, token: token }))
  } catch (error) {
    console.log(error)
    res.json(new Response('Something Went Wrong', false))
  }
});

router.get('/', tokenValid, async function (req, res, next) {
  try {
    const total = await User.countDocuments()
    const page =  parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 3
    const limit = 3
    const offset = (page - 1) * pageSize
    const pages = Math.ceil(total / pageSize)
    const users = await User.find().skip(offset).limit(pageSize).sort({'_id': -1})
    res.status(200).json(new Response({
      users,
      // limit,
      // page,
      // pages,
      // total
    }))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response('Error Showing Data Users', false))
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { email, password } = req.body
    const users = await User.create({
      email: email,
      password: password
    })
    res.status(200).json(new Response(users))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response('Error Showing Data Users', false))
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const users = await User.findByIdAndUpdate(id, req.body, {new : true})
    res.status(200).json(new Response(users))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response('Error Showing Data Users', false))
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const users = await User.findByIdAndRemove(id)
    res.status(200).json(new Response(users))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response('Error Showing Data Users', false))
  }
});

module.exports = router;
