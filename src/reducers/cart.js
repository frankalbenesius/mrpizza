import { ADD_PIZZA, REMOVE_PIZZA } from './actions'

function cart(state = [], action) {
  switch (action.type) {
    case ADD_PIZZA: {
      return [
        ...state,
        {
          size: action.payload.size,
          toppings: action.payload.toppings,
        },
      ]
    }
    case REMOVE_PIZZA: {
      const pizzaIndex = action.payload
      return [
        ...state.slice(0, pizzaIndex),
        ...state.items.slice(pizzaIndex + 1),
      ]
    }
    default:
      return state
  }
}

export const addPizza = (size, toppings) => {
  return {
    type: ADD_PIZZA,
    payload: {
      size,
      toppings,
    },
  }
}

export const removePizza = index => {
  return {
    type: ADD_PIZZA,
    payload: index,
  }
}

export default cart
