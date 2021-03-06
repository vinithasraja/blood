'use strict'

let Sequelize = require('sequelize');
let sequelize = new Sequelize('blood', process.env.sqluid, process.env.sqlpw);

let Donor = sequelize.define('donor', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  fbid: Sequelize.STRING,
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  address: Sequelize.STRING,
  photo: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  bloodtype: Sequelize.STRING,
  lastcontacted: Sequelize.DATE,
});

let Hospital = sequelize.define('hospital', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  email: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  opos: {type: Sequelize.INTEGER, defaultValue: 20},
  oneg: {type: Sequelize.INTEGER, defaultValue: 20},
  apos: {type: Sequelize.INTEGER, defaultValue: 20},
  aneg: {type: Sequelize.INTEGER, defaultValue: 20},
  bpos: {type: Sequelize.INTEGER, defaultValue: 20},
  bneg: {type: Sequelize.INTEGER, defaultValue: 20},
  abpos: {type: Sequelize.INTEGER, defaultValue: 20},
  abneg: {type: Sequelize.INTEGER, defaultValue: 20},
});

sequelize.sync();

module.exports.Donor = Donor;
module.exports.Hospital = Hospital;
