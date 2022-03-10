const knex = require("../db/connection");

function list() {
  return knex("restaurants").select("restaurant_name", "restaurant_cuisine");
}

// Complete the create() function to create a new restaurant in the restaurants table, 
// returning all columns of the newly created restaurant in the result.

function create(restaurant) {
  return knex("restaurants")
    .insert(restaurant)
    .returning("*")
    .then((data) => data[0]);
}

function read(restaurant_id = 0) {
  return knex("restaurants").select("*").where({ restaurant_id }).first();
}

function update(updatedRestaurant) {
  return knex("restaurants")
    .select("*")
    .where({ restaurant_id: updatedRestaurant.restaurant_id })
    .update(updatedRestaurant, "*");
}

// Complete the destroy() function to delete a restaurant given the restaurant ID.

function destroy(restaurant_id) {
  return knex("restaurants").where({ restaurant_id }).del();
}

module.exports = {
  create,
  list,
  read,
  update,
  delete: destroy,
};
