import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo'

import cart from './reducers/cart'
import App from './components/App'

const networkInterface = createNetworkInterface({
  uri: 'https://core-graphql.dev.waldo.photos/pizza',
})

const client = new ApolloClient({
  networkInterface,
})

const store = createStore(
  combineReducers({
    cart,
    apollo: client.reducer(),
  }),
  {}, // initialState
  compose(
    applyMiddleware(client.middleware()),
    // If you are using the devToolsExtension, you can add it here also
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f,
  ),
)

render(
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)
