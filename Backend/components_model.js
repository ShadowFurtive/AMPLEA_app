'use strict';
/*jshint node: true */
/*jshint esversion: 6 */
const fs = require("fs");

// Nom del fitxer de text on es guarden els elements en format JSON.
const DB_FILENAME = "datos.json";


// Model de dades.
//
// Aquesta variable guarda tots els elements com un array d'objectes,
// on els atributs de cada objecte són els seus camps.
//
// Al principi aquesta variable conté tres elements, però desprès es crida a load()
// per carregar els elements guardats en el fitxer DB_FILENAME si existeix.
let datos = [];


/**
 *  Carrega els elements en format JSON del fitxer DB_FILENAME.
 *
 *  El primer cop que s'executa aquest mètode, el fitxer DB_FILENAME no
 *  existeix, i es produirà l'error ENOENT. En aquest cas es guardarà el
 *  contingut inicial.
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
 *  Guarda els elements en format JSON en el fitxer DB_FILENAME.
 */
const save = () => {
  fs.writeFile(DB_FILENAME, JSON.stringify(datos),
    err => {
      if (err) throw err;
    });
};


exports.getAllCountries = (where) => {
  where  = (typeof where  !== 'undefined') ?  where : {};
  return new Promise((resolve, reject) => {
    datos.paises.map((e, i) => e.id = i);
    let t = datos.paises.filter(e => {
      for (let f in where) {
        let ok = false;
        if (where[f] instanceof Array) {
          let val = where[f][0];
          ok = e.name.toLowerCase().includes(val.toLowerCase());
        } else {// No operator means === operator
          ok = e === where[f];
        }
        if (!ok) return false;
      }
      return true;
    });
    resolve(JSON.parse(JSON.stringify(t)));
  });
};

exports.getConsum = (id) => {
  return new Promise((resolve, reject) => {
    const listaNueva =  datos.consumition.filter(function(datos) {
      return datos.machineId === id;
    });
    if(!listaNueva) reject(new Error(`No hay datos cargados`));
    resolve(JSON.parse(JSON.stringify(listaNueva)));
  });
};

exports.getLightStatus= (id) => {
  return new Promise((resolve, reject) => {
    const statusLight =  datos.light.find((i) => i.machineId === id);
    if(!statusLight) reject(new Error(`Error fatal. Contacte con un administrador`));
    resolve(JSON.parse(JSON.stringify(statusLight)));
  });
};

// user options
exports.checkUser = (user, password) => {
  return new Promise((resolve, reject) => {
    let valor = datos.products.find((i) => i.user === user && i.password === password);
    if(!valor) reject(new Error(`El usuario no existe. Contacte con un administrador`));
    resolve(JSON.parse(JSON.stringify(valor)));
  });
}


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


exports.getAcces = (id, user_id) => {
  return new Promise((resolve, reject) => {
    let valor = datos.paises.find((i) => i.paisesId === parseInt(id) && i.usuariosId === parseInt(user_id));
    if(valor === undefined) valor=false;
    else valor=true;
    resolve(JSON.parse(JSON.stringify(valor)));
  });
}

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

exports.getWaterConsumToday = (machineId) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const statusLight =  datos.consumition.filter(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00:000
  
      return (
        element.machineId === machineId &&
        element.type === 0 &&
        elementDate.getTime() === currentDate.getTime()
      );
    });

    const totalConsumption = statusLight.reduce((sum, element) => sum + element.consum, 0);
    resolve(JSON.parse(JSON.stringify(totalConsumption)));
  });
}; 

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

exports.getWaterConsumWeek = (machineId) => {
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
  
    const consumptionArray = Array(7).fill(0);
  
    statusLight.forEach(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.floor((currentDate - elementDate) / (24 * 60 * 60 * 1000));
      if (daysAgo >= 0 && daysAgo < 7) {
        consumptionArray[6 - daysAgo] += element.consum;
      }
    });
    
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


exports.getElectricityConsumToday = (machineId) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const statusLight =  datos.consumition.filter(element => {
      const elementDate = new Date(element.date);
      elementDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00:000
  
      return (
        element.machineId === machineId &&
        element.type === 1 &&
        elementDate.getTime() === currentDate.getTime()
      );
    });

    const totalConsumption = statusLight.reduce((sum, element) => sum + element.consum, 0);
    resolve(JSON.parse(JSON.stringify(totalConsumption)));
  });
}; 


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
    console.log(statusLight)

    const totalConsumption = statusLight.reduce((sum, element) => sum + element.consum, 0);
  
    resolve(JSON.parse(JSON.stringify(totalConsumption)));
  });
}; 


// Carrega els elements guardats en el fitxer si existeix.
load();
