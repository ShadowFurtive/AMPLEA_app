"use strict";
/*jshint esversion: 6 */
const express = require('express');
var cors = require('cors')
const app = express();

app.use(cors())

// Import MW for parsing POST params in BODY
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Import MW supporting Method Override with express
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const components_model = require('./components_model');

// CONTROLLER

/*
All the functions in this file do the same. Are the one that get the data in req.body and prepare them to be treat
at component_model.js
First the params are obtained from the http.request and once all the params are correct must call the function that is
in component_model.js.
Once the function in component_model.js is finished, it returns the final result.
If everything went okey, the function send a result with status 201 and with the params asked. 
If not, It would send an error to the console.log of the aplication.

*/

const getLightStatus = (req, res, next) => {
  let id = Number(req.params.id);
  components_model.getLightStatus(id)
  .then(lightStatus => {
    res.status(201).send({
      success: 'true',
      message: lightStatus,
    });
  })
  .catch(error => {next(Error(`DB error:\n${error}`));});
};
 
const loginController = (req, res, next) => {
  let user = req.query.user;
  let password =  req.query.password;
  if(!user || !password)
    throw Error('user and password is required');

  components_model.checkUser(user, password)
  .then((valor) => {
    res.status(201).send({
      success: 'true',
      message: valor,
    });
  })
  .catch(error => {next(Error(`User not exist:\n${error}`));});
};

const modifyLightStatus = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.modifyLightStatus(iduser)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'Done',
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const modifyLightPower = (req, res, next) => {
  let iduser = Number(req.params.id);
  let power = req.body.percentage;
  if(!iduser || !power)
    throw Error('Id and power user are required');
  components_model.modifyLightPower(iduser, power)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'Done',
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};


const modifyLightSchedule = (req, res, next) => {
  let iduser = Number(req.params.id);
  let start_hour = req.body.start_hour;
  let end_hour = req.body.end_hour;
  if(!iduser || !start_hour || !end_hour)
    throw Error('Id, start hour and end hour are required');
  components_model.modifyLightSchedule(iduser, start_hour, end_hour)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'Done',
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const modifyLightAutomatic = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.modifyLightAutomatic(iduser)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'Done',
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const getWaterConsumToday = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.getConsumToday(iduser, 0)
  .then((totalConsumption) => {
    res.status(201).send({
      success: 'true',
      message: totalConsumption,
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const getWaterConsumAverage = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.getWaterConsumAverage(iduser)
  .then((totalAverage) => {
    res.status(201).send({
      success: 'true',
      message: totalAverage,
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const getWaterConsumWeek = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.getConsumWeek(iduser, 0)
  .then((consumeWeek) => {
    res.status(201).send({
      success: 'true',
      message: consumeWeek,
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const getElectricityConsumToday = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.getConsumToday(iduser, 1)
  .then((totalConsumption) => {
    res.status(201).send({
      success: 'true',
      message: totalConsumption,
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const getElectricityConsumWeek = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.getElectricityConsumWeek(iduser)
  .then((totalConsumption) => {
    res.status(201).send({
      success: 'true',
      message: totalConsumption,
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const getElectricityConsumMonth = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.getElectricityConsumMonth(iduser)
  .then((totalConsumption) => {
    res.status(201).send({
      success: 'true',
      message: totalConsumption,
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const getElectricityConsum = (req, res, next) => {
  let iduser = Number(req.params.id);
  if(!iduser)
    throw Error('Id user are required');
  components_model.getConsumWeek(iduser, 1)
  .then((consumeWeek) => {
    res.status(201).send({
      success: 'true',
      message: consumeWeek,
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};


const modifyUser = (req, res, next) => {
  let idusuario = Number(req.params.id);
  let {user, password} = req.body;
  if(!idusuario || (!user || !password))
    throw Error('User or password are required');
  components_model.modifyUser(idusuario, user, password)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'Done',
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};

const updateData = (req, res, next) => {
  // Convert the modified object to JSON
  
  let idusuario = Number(req.params.id);
  let data = JSON.stringify(req.body);
  if(!idusuario || !data)
    throw Error('User or data are required');
  components_model.updateData(idusuario, JSON.parse(data))
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'Done',
    });
  })
  .catch(error => {next(Error(`An error ocurred:\n${error}`));});
};


const errorController = (err, req, res, next) => {
  if (req.originalUrl.includes('/api/'))
    res.status(409).send({
     success: 'false',
     message: err.toString(),
   });
  else
    res.status(409).send(err.toString());
};

// middleware to use for all requests
const logController = (req, res, next) => {
  // do logging
  console.log('req.method = ' + req.method);
  console.log('req.URL = ' + req.originalUrl);
  console.log('req.body = ' + JSON.stringify(req.body));
  console.log("======================");
  //console.log('req.path = ' + req.path);
  //console.log('req.route = ' + req.route);
  next(); // make sure we go to the next routes and don't stop here
};

// middleware to use for all requests
const headersController = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, PATCH, DELETE');
  next(); // make sure we go to the next routes and don't stop here
};


// ROUTER
// All the API routes of the backend server
app.use   ('*',                 logController);
app.use   ('*',                 headersController);
app.get ('/', loginController);
app.get('/lightControl/:id',  getLightStatus);
app.get('/lightControlStatus/:id', modifyLightStatus);
app.get('/lightControlValue/:id', getLightStatus);
app.get('/lightControlAutomatic/:id', modifyLightAutomatic);
app.put('/lightScheduleModifier/:id', modifyLightSchedule);
app.put('/lightControlPower/:id', modifyLightPower);
app.get('/waterConsumToday/:id', getWaterConsumToday);
app.get('/waterConsumAverage/:id', getWaterConsumAverage);
app.get('/waterConsumWeek/:id', getWaterConsumWeek);
app.get('/electricityConsumToday/:id', getElectricityConsumToday);
app.get('/electricityConsumMonth/:id', getElectricityConsumMonth);
app.get('/electricityConsumWeek/:id', getElectricityConsumWeek);
app.get('/ElectricityConsum/:id', getElectricityConsum);
app.put('/login/:id', modifyUser);
app.put('/updateData/:id', updateData);
app.use(errorController);

app.all('*', (req, res) =>
  res.status(409).send("Error: resource not found or method not supported")
);        


// Server started at port 8000
const PORT = 8000;
const serverIP = '0.0.0.0';
app.listen(PORT, serverIP,
  () => {console.log(`Server running on port ${PORT} and ${serverIP}` );}
  );