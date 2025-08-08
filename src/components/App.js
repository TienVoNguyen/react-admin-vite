import React, { Suspense, lazy } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from './Snackbar';
import { CircularProgress, Box } from '@mui/material';

// Lazy load large components
const Layout = lazy(() => import('./Layout'));
const Documentation = lazy(() => import('./Documentation/Documentation'));

// pages
import Error from '../pages/error';
import Login from '../pages/login';
import Verify from '../pages/verify';
import Reset from '../pages/reset';

// context
import { useUserState } from '../context/UserContext';
import { getHistory } from '../index';

// Loading component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress size={60} />
  </Box>
);

export default function App() {
  // global
  let { isAuthenticated } = useUserState();
  const isAuth = isAuthenticated();

  return (
    <>
      <SnackbarProvider>
        <ConnectedRouter history={getHistory()}>
          <Router history={getHistory()}>
            <Suspense fallback={<LoadingFallback />}>
              <Switch>
                <Route
                  exact
                  path='/'
                  render={() => <Redirect to='/app/profile' />}
                />

                <Route
                  exact
                  path='/app'
                  render={() => <Redirect to='/app/dashboard' />}
                />

                <Route path='/documentation' component={Documentation} />
                <PrivateRoute path='/app' component={Layout} />
                <PublicRoute path='/login' component={Login} />
                <PublicRoute path='/verify-email' exact component={Verify} />
                <PublicRoute path='/password-reset' exact component={Reset} />
                <Redirect from='*' to='/app/dashboard' />
                <Route component={Error} />
              </Switch>
            </Suspense>
          </Router>
        </ConnectedRouter>
      </SnackbarProvider>
    </>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuth ? (
            React.createElement(component, props)
          ) : (
            <Redirect to={'/login'} />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuth ? (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
