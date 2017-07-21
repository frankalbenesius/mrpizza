import React from 'react'
import glamorous from 'glamorous'

const Wrapper = glamorous.article({
  borderLeft: '3px solid #ff5550',
  padding: '0.25rem 0 0.25rem 1rem',
  margin: '1rem 0',
  position: 'relative',
})

const Header = glamorous.h1({
  fontSize: '1rem',
  textTransform: 'capitalize',
  margin: '0',
})

const RemoveButton = glamorous.button({
  border: 'none',
  position: 'absolute',
  top: '0',
  right: '0',
  color: '#ff5550',
  backgroundColor: 'white',
  fontWeight: 'bold',
})

const Toppings = glamorous.div({
  fontSize: '0.8rem',
})

const Pizza = ({ pizza, onRemove }) =>
  <Wrapper>
    <Header>
      {pizza.size} Pizza - ${pizza.price.toFixed(2)}
    </Header>
    <RemoveButton onClick={onRemove}>X</RemoveButton>
    <Toppings>
      {pizza.toppings.join(', ')}
    </Toppings>
  </Wrapper>

export default Pizza
