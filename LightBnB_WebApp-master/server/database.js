/*const properties = require('./json/properties.json');*/
/*const users = require('./json/users.json');*/

// Connect to our database to web application
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;

  const values =[email];

  // Using a promise to query
  return pool.query(queryString, values)
    .then(res => {
      const users = res.rows[0];
      return users;
    })
    .catch(err => console.log('query error', err));
  
  // Old code
  /*let user;
  for (const userId in users) {
    user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }
  return Promise.resolve(user);*/
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
    SELECT *
    FROM users
    WHERE id = $1;
  `;

  const values = [id];

  // Using a promise to query
  return pool.query(queryString, values)
    .then(res => {
      const users = res.rows[0];
      return users;
    })
    .catch(err => console.log('query error', err));

  // Old code
  //return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `
  INSERT INTO users (
    name, email, password) 
    VALUES (
    $1, $2, $3)
    RETURNING *;
  `;

  // Potnetially malicious part of query (User command line input)
  const values = [user.name, user.email, user.password];

  // Using a promise to query
  return pool.query(queryString, values)
    .then(res => res.rows[0])
    .catch(err => console.log('query error', err));

  // Old code
  /*const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);*/
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // Parameterized query to prevent SQL injection attacks
  // Safe part of the query
  const queryString = `
    SELECT *
    FROM properties
    LIMIT $1;
  `;

  // Potnetially malicious part of query (User command line input)
  const values = [`${limit}`];

  // Using a promise to query
  return pool.query(queryString, values)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack));
  
  // Old code
  /*const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  return Promise.resolve(limitedProperties);*/
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
