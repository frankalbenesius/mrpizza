import React from 'react'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'
import glamorous from 'glamorous'

import { addPizza } from '../../reducers/cart'

const gray = '#bbb'

// these presentational components could be refactored to their own
// folders in ../presentationals.

const SubHeader = glamorous.h2({
  fontSize: '1rem',
})

const SubmitButton = glamorous.input({
  backgroundColor: '#ff5550',
  border: 'none',
  color: 'white',
  marginTop: '1.5rem',
  padding: '0.5rem 1rem',
  fontSize: '1rem',
})

const Price = glamorous.span({
  color: gray,
  fontStyle: 'italic',
  paddingLeft: '1rem',
})

const mapDispatchToProps = dispatch => {
  return {
    addPizzaToCart: pizza => dispatch(addPizza(pizza)),
  }
}

const pizzaSizesQuery = gql`
  query {
    pizzaSizes {
      name
      maxToppings
      basePrice
      toppings {
        defaultSelected
        topping {
          name
          price
        }
      }
    }
  }
`

// setState function for changing the selected pizza size
const setSize = size => {
  return (state, props) => ({
    selectedSize: size,
  })
}

// setState function resetting to the default pizza configurations
// used on load and on submit
const resetPizzas = (state, props) => ({
  selectedSize: props.data.pizzaSizes[0].name,
  maxToppings: props.data.pizzaSizes.reduce((acc, size) => {
    acc[size.name] = size.maxToppings
    return acc
  }, {}),
  pizzas: props.data.pizzaSizes.reduce((acc, size) => {
    acc[size.name] = size.toppings.map(topping => {
      return {
        selected: topping.defaultSelected,
        name: topping.topping.name,
        price: topping.topping.price,
      }
    })
    return acc
  }, {}),
})

// setState function used to toggle individual toppings in our pizza arrays
const toggleTopping = (size, toppingName) => {
  return (state, props) => ({
    pizzas: {
      ...state.pizzas,
      [size]: state.pizzas[size].map(topping => {
        return {
          ...topping,
          selected:
            topping.name === toppingName ? !topping.selected : topping.selected,
        }
      }),
    },
  })
}

class OrderForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSize: undefined, // current size of pizza being built
      pizzas: {}, // array of toppings for each size
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.selectedSize && nextProps.data.pizzaSizes) {
      // graphql data received, safe to begin using order form
      this.setState(resetPizzas)
    }
  }
  handleSizeChange = changeEvent => {
    this.setState(setSize(changeEvent.target.value))
  }
  handleToppingSelect = (size, name) => {
    return () => {
      this.setState(toggleTopping(size, name))
    }
  }
  handleSubmit = event => {
    event.preventDefault()

    const pizza = {
      size: this.state.selectedSize,
      toppings: this.state.pizzas[this.state.selectedSize]
        .filter(t => t.selected)
        .map(t => t.name),
    }

    this.props.addPizzaToCart(pizza)

    this.setState(resetPizzas)
  }
  pizzaIsFull = size => {
    const max = this.state.maxToppings[size]
    if (max === null) {
      return false
    }
    const count = this.state.pizzas[size].filter(x => x.selected).length
    return count >= max
  }
  render() {
    const data = this.props.data
    if (data.loading) {
      return <div>Loading Pizza Data...</div>
    }
    if (data.error) {
      return (
        <div>Error loading pizza data. Please try refreshing the page.</div>
      )
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <section>
          <SubHeader>Choose Your Size:</SubHeader>
          {data.pizzaSizes.map(pizzaSize => {
            return (
              <div key={pizzaSize.name}>
                <input
                  id={`size_${pizzaSize.name}`}
                  type="radio"
                  name="size"
                  value={pizzaSize.name}
                  onChange={this.handleSizeChange}
                  checked={this.state.selectedSize === pizzaSize.name}
                />{' '}
                <label htmlFor={`size_${pizzaSize.name}`}>
                  {pizzaSize.name}
                  <Price>
                    ${pizzaSize.basePrice.toFixed(2)}
                  </Price>
                </label>
              </div>
            )
          })}
        </section>
        <section>
          <SubHeader>Choose Your Toppings:</SubHeader>
          {this.state.pizzas[this.state.selectedSize].map(topping => {
            const disabled =
              !topping.selected && this.pizzaIsFull(this.state.selectedSize)
            return (
              <div key={topping.name}>
                <input
                  id={`topping_${this.state.selectedSize}_${topping.name}`}
                  type="checkbox"
                  disabled={disabled}
                  checked={topping.selected}
                  onChange={this.handleToppingSelect(
                    this.state.selectedSize,
                    topping.name,
                  )}
                />{' '}
                <label
                  htmlFor={`topping_${this.state.selectedSize}_${topping.name}`}
                  style={{ color: disabled ? gray : 'black' }}
                >
                  {topping.name}
                  <Price>
                    ${topping.price.toFixed(2)}
                  </Price>
                </label>
              </div>
            )
          })}
        </section>
        <SubmitButton type="submit" value="Add Pizza To Cart" />
      </form>
    )
  }
}

// connect OrderForm with the apollo HOC
const OrderFormWithData = graphql(pizzaSizesQuery)(OrderForm)

// connect OrderForm with the redux HOC
const OrderFormWithDataAndState = connect(() => ({}), mapDispatchToProps)(
  OrderFormWithData,
)

export default OrderFormWithDataAndState
