import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, CssBaseline, Typography } from '@material-ui/core';
import theme from './theme';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import AuthProvider from './auth';
import client from './graphql/client';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {}

  render() {
    if (this.state.hasError) {
      return (
        <Typography component='h1' variant='h6' align='ceter'>
          Oops! Something went wrong.
        </Typography>
      );
    }
    return this.props.children;
  }
}

ReactDOM.render(
  <ErrorBoundary>
    <ApolloProvider client={client}>
      <AuthProvider>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MuiThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);
