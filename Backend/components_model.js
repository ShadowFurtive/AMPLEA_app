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


// Carrega els elements guardats en el fitxer si existeix.
load();
