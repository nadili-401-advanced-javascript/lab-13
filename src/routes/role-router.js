'use strict';

const express = require('express');
const router = express.Router();

const Roles = require('../models/roles-model.js');
const roles = new Roles();

const auth = require('../middleware/auth.js');
const err401 = require('../middleware/403.js');
const err403 = require('../middleware/403.js');

// TODO: Swagger Comments
// Visible by all clients
router.get('/public', err401, (req, res, next) => {
  res.status(200).json({ valid: true });
});

// === TODO: Define all the routes below ======

router.use(auth);

// TODO: Swagger Comments
// Visible by logged in clients
router.get('/hidden', auth, (req, res, next) => {
  if (req.user&& req.user._id){
    res.status(200).json({ valid: true });
  } else next ('Unable to find user');
}, err403);

// TODO: Swagger Comments
// Visible by roles that have the "read" capability
router.get('/read-only', auth, err401, async (req, res, next) => {
  if (req.user&& req.user._id){
    let role = req.user.role;
    let roleData = await roles.getFromField({role: role});
    let capabilities = roleData[0].capabilities;

    if(capabilities.includes('read')){
      res.status(200).json({ valid: true });
    } else  next('Icorrect role access');
  }else next ('Unable to find user');
}, err403);

// TODO: Swagger Comments
// Accessible by roles that have the "create" capability
router.post('/create', (req, res, next) => {});

// TODO: Swagger Comments
// Accessible by roles that have the "update" capability
router.put('/update/:id', (req, res, next) => {});

// TODO: Swagger Comments
// Accessible by roles that have the "delete" capability
router.delete('/delete/:id', (req, res, next) => {});

// TODO: Swagger Comments
// Visible by roles that have the "superuser" capability
router.get('/super', (req, res, next) => {});

module.exports = router;
