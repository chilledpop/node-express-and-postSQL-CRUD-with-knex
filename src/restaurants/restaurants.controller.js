const restaurantsService = require("./restaurants.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");


// Update the create() route handler to call the create() method of the service and return a 201 status code along with the newly created restaurant.
// Validate that the request body only contains the properties restaurant_name, cuisine, and address, and validate that each property has a value. 
// Return a 400 status code if the validation fails.

const VALID_PROPERTIES = [
  "restaurant_id",
  "restaurant_name",
  "cuisine",
  "address",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const hasRequiredProperties = hasProperties(
  "restaurant_name",
  "cuisine",
  "address"
);

async function restaurantExists(req, res, next) {
  const { restaurantId } = req.params;

  const restaurant = await restaurantsService.read(restaurantId);

  if (restaurant) {
    res.locals.restaurant = restaurant;
    return next();
  }
  next({ status: 404, message: `Restaurant cannot be found.` });
}

async function list(req, res, next) {
  const data = await restaurantsService.list();
  res.json({ data });
}

async function create(req, res, next) {
  restaurantsService
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);
}

async function update(req, res, next) {
  const updatedRestaurant = {
    ...res.locals.restaurant,
    ...req.body.data,
    restaurant_id: res.locals.restaurant.restaurant_id,
  };

  const data = await restaurantsService.update(updatedRestaurant);

  res.json({ data });
}

// Update the destroy() route handler to call the delete() method of the service, and return a 204 status code upon successful restaurant deletion.

async function destroy(req, res, next) {
  restaurantsService
    .delete(res.locals.restaurant.restaurant_id)
    .then(() => res.sendStatus(204))
    .catch(next);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(create),
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(create),
  ],
  update: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(destroy)],
};
