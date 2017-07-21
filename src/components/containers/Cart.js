import React from 'react'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'

const mapStateToProps = state => {
  return {
    cart: state.cart,
  }
}

const pizzaSizesQuery = gql`
  query {
    pizzaSizes {
      name
      maxToppings #only form needs to know this
      basePrice
      toppings {
        defaultSelected #only form needs to know this
        topping {
          name
          price
        }
      }
    }
  }
`

const Cart = ({ cart, data }) => {
  return (
    <div>
      Pizzas in Cart: {cart.length}
    </div>
  )
}

const CartWithData = graphql(pizzaSizesQuery)(Cart) // adds the "data" prop

const CartWithDataAndState = connect(mapStateToProps)(CartWithData)

export default CartWithDataAndState
