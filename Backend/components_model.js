'use strict';
/*jshint node: true */
/*jshint esversion: 6 */
const fs = require("fs");
const { start } = require("repl");

// Name of the file with the data
const DB_FILENAME = "datos.json";
let datos = [];


/**
Load the data from the file datos.json in the variable datos.
 */
const load = () => {
  fs.readFile(DB_FILENAME, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        save();
        return;
      }
      throw err;
    }

    let json = JSON.parse(data);
    if (json) {
      datos = json;
    }
  });
};


/**
 Save the elements in the files datos.json
 */
const save = () => {
  fs.writeFile(DB_FILENAME, JSON.stringify(datos),
    err => {
      if (err) throw err;
    });
};

/*
Return if the light is on/off and if it's in automatic. These value are the one asked for the id. 
*/
exports.getLightStatus= (id) => {
  return new Promise((resolve, reject) => {
    const statusLight =  datos.light.find((i) => i.machineId === id);
    if(!statusLight) reject(new Error(`Error fatal. Contacte con un administrador`));
    var data = {
      status: statusLight.status,
      automatic: statusLight.automatic
    };
    resolve(JSON.parse(JSON.stringify(data)));
  });
};



/*
Check if the credentials for the user and password exist.
*/
exports.checkUser = (user, password) => {
  return new Promise((resolve, reject) => {
    let valor = datos.products.find((i) => i.user === user && i.password === password);
    if(!valor) reject(new Error(`El usuario no existe. Contacte con un administrador`));
    resolve(JSON.parse(JSON.stringify(valor)));
  });
}

/*
Modifies the values of the user. Can be the user or the password to be modified. 
As always, we get the data that has the value of the idUser.
*/
exports.modifyUser = (idUsuario, user, password) => {
  return new Promise((resolve, reject) => {
    const dato = datos.products.find((i) => i.id === idUsuario);
    if (typeof dato === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      if(user != "") dato.user = user;
      if(password != "") dato.password = password;
      save();
      resolve();
    }
  });
};


/*
Turn off/on the lights. It changes the boolean value in the dataset.
*/
exports.modifyLightStatus = (iduser) => {
  return new Promise((resolve, reject) => {
    const statusLight =  datos.light.find((i) => i.machineId === iduser);
    if (typeof statusLight === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      statusLight.status = +!statusLight.status;
      save();
      resolve();
    }
  });
}; 

/*
Change the lightSchedule for the one asked.
*/
exports.modifyLightSchedule = (iduser, start_hour, end_hour) => {
  return new Promise((resolve, reject) => {
    const light =  datos.light.find((i) => i.machineId === iduser);
    if (typeof light === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      light.hourStart = start_hour;
      light.hourEnd = end_hour;
      save();
      resolve();
    }
  });
}; 

/*
Modify the status of the light to be automatic or manual.
*/
exports.modifyLightAutomatic = (iduser) => {
  return new Promise((resolve, reject) => {
    const statusLight =  datos.light.find((i) => i.machineId === iduser);
    if (typeof statusLight === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      statusLight.automatic = +!statusLight.automatic;
      save();
      resolve();
    }
  });
}; 

/*
Modifies the power of the lights.
*/
exports.modifyLightPower = (iduser, power) => {
  return new Promise((resolve, reject) => {
    const statusLight =  datos.light.find((i) => i.machineId === iduser);
    if (typeof statusLight === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      statusLight.power = Number(power);
      save();
      resolve();
    }
  });
}; 

/*
Here it does the average liter consumed of the last 7 days. 
First it get the current date and the date of 7 days ago. 
Gets all the data generated between these 2 days and do the average.
*/
exports.getWaterConsumAverage = (machineId) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
  
    const statusLight = datos.consumition.filter(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0);
  
      return (
        element.machineId === machineId &&
        element.type === 0 &&
        elementDate >= sevenDaysAgo &&
        elementDate <= currentDate
      );
    });
  
    const totalElementsObtained = statusLight.length;
    const totalConsumption = statusLight.reduce((sum, element) => sum + element.consum, 0);
    const averageConsumption = (totalConsumption / totalElementsObtained).toFixed(1);
  
    resolve(JSON.parse(JSON.stringify(averageConsumption)));
  });
}; 

/*
Gets the consumption of the electricity or water (depending of the type) of the last 7 days.
It an array the date and the consumption of that day so it can be used in the cart.
*/
exports.getConsumWeek = (machineId, type) => {
  return new Promise((resolve, reject) => {
    // get consumption values of the last 7 days.
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
  
    const statusLight = datos.consumition.filter(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0);
  
      return (
        element.machineId === machineId &&
        element.type === type &&
        elementDate >= sevenDaysAgo &&
        elementDate <= currentDate
      );
    });
  
    const consumptionArray = Array(7).fill(0);
  
    statusLight.forEach(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.floor((currentDate - elementDate) / (24 * 60 * 60 * 1000));
      if (daysAgo >= 0 && daysAgo < 7) {
        consumptionArray[6 - daysAgo] += element.consum;
      }
    });
    
    // Generate array with the date and the consumption of each day
    const consumptionObjectArray = [];
    const date = new Date();
    date.setDate(date.getDate() - 6);
    date.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const dateAux = new Date();
      dateAux.setDate(date.getDate() + i);
      dateAux.setHours(0, 0, 0, 0);
      const dayLabel = dateAux.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit"
      });
      const consumptionObject = {
        date: dayLabel,
        consumption: consumptionArray[i]
      };
      consumptionObjectArray.push(consumptionObject);
    }
  
    resolve(JSON.parse(JSON.stringify(consumptionObjectArray)));
  });
}; 

/*
Gets the consumption of the water or electrcity (depending of the type) of today
*/
exports.getConsumToday = (machineId, type) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const statusLight =  datos.consumition.filter(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00:000
  
      return (
        element.machineId === machineId &&
        element.type === type &&
        elementDate.getTime() === currentDate.getTime()
      );
    });

    const totalConsumption = statusLight.reduce((sum, element) => sum + element.consum, 0);
    resolve(JSON.parse(JSON.stringify(totalConsumption)));
  });
}; 

/*
Get the electricity consumption of the last 7 days and do the total
*/
exports.getElectricityConsumWeek = (machineId) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
  
    const statusLight = datos.consumition.filter(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0);
  
      return (
        element.machineId === machineId &&
        element.type === 1 &&
        elementDate >= sevenDaysAgo &&
        elementDate <= currentDate
      );
    });
  
    const totalConsumption = statusLight.reduce((sum, element) => sum + element.consum, 0);
  
    resolve(JSON.parse(JSON.stringify(totalConsumption)));
  });
}; 

/*
Return the total of the electrcity consumed during the last month.
*/
exports.getElectricityConsumMonth = (machineId) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const statusLight = datos.consumition.filter(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0);
      return (
        element.machineId === machineId &&
        element.type === 1 &&
        elementDate.getFullYear() === currentDate.getFullYear() &&
        elementDate.getMonth() === currentDate.getMonth()
      );
    });

    const totalConsumption = statusLight.reduce((sum, element) => sum + element.consum, 0);
  
    resolve(JSON.parse(JSON.stringify(totalConsumption)));
  });
}; 

/*
This function is the one that call the sensors to update the data.
First, we check if the value to publish is float or integer, as for example the electrcity sensor can upload
floats. In the other hand, the water flow sensors only upload integer.
Once that is checked, the json is generated and there a is check to see if there is already an index with the current date.
If the index exists, is overwritten by the new json generated. 
If not, a new json is added to the dataset.

*/
exports.updateData = (machineId, data) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString();
    const consumValue = parseFloat(data.consum);
    // Check if it's float or integer
    let parsedValue;
    if (!isNaN(consumValue)) {
      if (Number.isInteger(consumValue)) {
        parsedValue = parseInt(consumValue); 
      } else {
        parsedValue = consumValue; 
      }
    } 
    //Generate JSON
    const json = {
      id: 1,
      machineId: machineId,
      type: parseInt(data.type),
      consum: parsedValue,
      date: currentDate
    };
    //Check if there is any existing index with the date and the type.
    const existingIndex = datos.consumition.findIndex(item => (
      item.machineId === machineId &&
      item.type === parseInt(data.type) &&
      item.date.slice(0, 10) === currentDate.slice(0, 10)
    ));
    //If exist, overwrite. If not, new JSON is added
    if (existingIndex !== -1) {
      datos.consumition[existingIndex] = json;
    } else {
      datos.consumition.push(json);
    }

    save()
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Load the data in the file.
load();
