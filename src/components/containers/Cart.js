import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return {
    cart: state.cart,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

const Cart = ({ cart }) =>
  <h1>
    Cart: {cart}
  </h1>

const ConnectedCart = connect(mapStateToProps, mapDispatchToProps)(Cart)

export default ConnectedCart
