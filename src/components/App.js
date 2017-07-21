import React, { Component } from 'react'
import { css } from 'glamor'
import glamorous from 'glamorous'

import OrderForm from './containers/OrderForm'
import Cart from './containers/Cart'

css.global('body', {
  backgroundColor: '#ff5550',
  fontFamily: 'Menlo, monospace',
  margin: '1rem',
})

const Wrapper = glamorous.section({
  width: '50rem',
  margin: '0 auto',
  backgroundColor: 'white',
  padding: '1rem',
})

const SiteHeader = glamorous.h1({
  color: '#ff5550',
  textAlign: 'center',
})

const Panel = glamorous.section({
  padding: '1rem',
  display: 'inline-block',
  boxSizing: 'border-box',
  verticalAlign: 'top',
})

const PanelHeader = glamorous.h1({
  borderBottom: '2px solid black',
})

class App extends Component {
  render() {
    return (
      <Wrapper>
        <SiteHeader>Mr. Pizza</SiteHeader>
        <Panel css={{ width: '60%' }}>
          <PanelHeader>Pizza Order Form</PanelHeader>
          <OrderForm />
        </Panel>
        <Panel css={{ width: '40%' }}>
          <PanelHeader>Pizza Cart</PanelHeader>
          <Cart />
        </Panel>
      </Wrapper>
    )
  }
}

export default App
