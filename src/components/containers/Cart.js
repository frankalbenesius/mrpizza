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
      maxToppings
      basePrice
    }
  }
`

const Cart = ({ cart, data }) => {
  return (
    <div>
      <div>
        Cart: {cart}
      </div>
      <div>
        Pizza Sizes:{' '}
        {data.loading
          ? '...'
          : data.pizzaSizes.map(pizzaSize => pizzaSize.name).join(', ')}
      </div>
    </div>
  )
}

const CartWithData = graphql(pizzaSizesQuery)(Cart) // adds the "data" prop

const CartWithDataAndState = connect(mapStateToProps)(CartWithData)

export default CartWithDataAndState
