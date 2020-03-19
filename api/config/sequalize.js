var Sequelize = require('sequelize');
var env       = 'development';
var config    = require('./config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
module.exports= sequelize;
