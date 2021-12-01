import { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import './App.css';

const routes = [
  {
    path: "/login",
    Component: lazy(() => import(`./Screens/Login/Index`)),
    exact: true,
  },
  {
    path: "/dashboard",
    Component: lazy(() => import(`./Screens/Dashboard/Index`)),
    exact: true,
  },
  {
    path: "/task",
    Component: lazy(() => import(`./Screens/Task/Index`)),
    exact: true,
  },
  {
    path: "/profile",
    Component: lazy(() => import(`./Screens/Profile/Index`)),
    exact: true,
  },
  {
    path: "/proxies",
    Component: lazy(() => import(`./Screens/Proxy/Index`)),
    exact: true,
  },
  {
    path: "/captcha",
    Component: lazy(() => import(`./Screens/Captcha/Index`)),
    exact: true,
  },
  {
    path: "/settings",
    Component: lazy(() => import(`./Screens/Settings/Index`)),
    exact: true,
  },
]

function App() {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => <Redirect to="/login" />}
      />
      {routes.map(({ path, Component, exact }) => (
        <Route
          path={path}
          key={path}
          exact={exact}
          render={() => {
            return (
              <div>
                <Suspense fallback={null}>
                  <Component />
                </Suspense>
              </div>
            )
          }}
        />
      ))}
      <Redirect to="/404" />
    </Switch>
  );
}

export default App;
