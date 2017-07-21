import React from 'react'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'

import { getCart, removePizza } from '../../reducers/cart'
import Pizza from '../presentationals/Pizza'

const mapStateToProps = state => {
  return {
    pizzas: getCart(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    removePizzaFromCart: index => {
      return () => dispatch(removePizza(index))
    },
  }
}

const pizzaSizesQuery = gql`
  query {
    pizzaSizes {
      name
      basePrice
      toppings {
        topping {
          name
          price
        }
      }
    }
  }
`

const Cart = ({ pizzas, data, removePizzaFromCart }) => {
  // the cart doesn't need to render if there's no data
  if (data.loading || !data.pizzaSizes) {
    return null
  }

  // build a helper object for determining prices
  const prices = data.pizzaSizes.reduce((acc, size) => {
    acc[size.name] = {
      base: size.basePrice,
      toppings: size.toppings.reduce((ts, t) => {
        ts[t.topping.name] = t.topping.price
        return ts
      }, {}),
    }
    return acc
  }, {})

  // a function to retrieve a price based on our pricer helper object "prices"
  const getPrice = pizza => {
    const priceGuide = prices[pizza.size]
    const priceForToppings = pizza.toppings
      .map(t => priceGuide.toppings[t])
      .reduce((a, b) => a + b)
    return priceGuide.base + priceForToppings
  }

  // add the price to the pizzas we're going to iterate through in rendering
  const pizzasWithPrice = pizzas.map(pizza => ({
    ...pizza,
    price: getPrice(pizza),
  }))

  // add up all the pizza totals to get the cart total
  const cartTotal = pizzasWithPrice.reduce((sum, p) => sum + p.price, 0)

  return (
    <div>
      Cart Total: ${cartTotal.toFixed(2)} ({pizzasWithPrice.length} items)
      {pizzasWithPrice.map((pizza, idx) => {
        return (
          <Pizza key={idx} pizza={pizza} onRemove={removePizzaFromCart(idx)} />
        )
      })}
    </div>
  )
}

// connect Cart with the apollo HOC
const CartWithData = graphql(pizzaSizesQuery)(Cart) // adds the "data" prop

// connect Cart with the redux HOC
const CartWithDataAndState = connect(mapStateToProps, mapDispatchToProps)(
  CartWithData,
)

export default CartWithDataAndState
