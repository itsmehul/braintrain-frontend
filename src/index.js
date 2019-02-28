import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
//STYLING
import './index.scss'

//COMPONENTS
import App from './containers/App'

//FIREBASE
import Firebase, { FirebaseContext } from './components/Firebase'

//APOLLO
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from './constants/authToken'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import { teal, indigo, red } from '@material-ui/core/colors'

//REDUX
import { Provider } from 'react-redux'
import store from './store/index'

const theme = createMuiTheme({
	// typography:{
	//   button: {
	//     fontStyle: 'italic',
	//   },
	// },
	// overrides: {
	//   MuiButton: {
	//     // Name of the component ⚛️ / style sheet
	//     text: {
	//       // Name of the rule
	//       color: "yellow" // Some CSS
	//     }
	//   },
	//   MuiAppBar: {
	//     root: { boxShadow:'none' }
	//   },
	// MuiPaper:{
	// 	root:{
	// 		margin:'7px'
	// 	}
	// },
	//   MuiToolbar: {
	//     root: { backgroundColor: "#ffffff", fontColor:'black' }
	//   }
	// },

	palette: {
		primary: teal,
		secondary: indigo,
		danger: red
	}
})

const httpLink = createHttpLink({
	uri: 'https://fathomless-cove-25949.herokuapp.com/'
})
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem(AUTH_TOKEN)
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})
const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	onError: ({ networkError, graphQLErrors }) => {
		console.log('graphQLErrors', graphQLErrors)
		console.log('networkError', networkError)
	}
})

ReactDOM.render(
	<Provider store={store}>
		<FirebaseContext.Provider value={new Firebase()}>
			<ApolloProvider client={client}>
				<MuiThemeProvider theme={theme}>
					<App />
				</MuiThemeProvider>
			</ApolloProvider>
		</FirebaseContext.Provider>
	</Provider>,

	document.getElementById('root')
)

serviceWorker.unregister()
