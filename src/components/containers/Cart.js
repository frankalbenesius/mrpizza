import React from 'react'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'

import { removePizza } from '../../reducers/cart'
import Pizza from '../presentationals/Pizza'

const mapStateToProps = state => {
  return {
    pizzas: state.cart,
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
  if (!data.pizzaSizes) {
    // the cart doesn't need to render if there's no data source
    return null
  }

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

  const getPrice = pizza => {
    const priceGuide = prices[pizza.size]
    const priceForToppings = pizza.toppings
      .map(t => priceGuide.toppings[t])
      .reduce((a, b) => a + b)
    return priceGuide.base + priceForToppings
  }

  const pizzasWithPrice = pizzas.map(pizza => ({
    ...pizza,
    price: getPrice(pizza),
  }))

  const total = pizzasWithPrice.reduce((sum, p) => sum + p.price, 0)
  const count = pizzasWithPrice.length
  return (
    <div>
      Cart Total: ${total.toFixed(2)} ({count} item{count === 1 ? '' : 's'})
      {pizzasWithPrice.map((pizza, idx) => {
        return (
          <Pizza key={idx} pizza={pizza} onRemove={removePizzaFromCart(idx)} />
        )
      })}
    </div>
  )
}

const CartWithData = graphql(pizzaSizesQuery)(Cart) // adds the "data" prop

const CartWithDataAndState = connect(mapStateToProps, mapDispatchToProps)(
  CartWithData,
)

export default CartWithDataAndState
