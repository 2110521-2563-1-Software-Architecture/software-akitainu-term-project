/* eslint-disable react/no-array-index-key */
import React, { lazy, Suspense, Fragment } from "react";
import { Switch ,Route } from "react-router-dom";
import LoadingScreen from "components/LoadingScreen";
import Redirect from "components/Redirect";
import Home from 'views/Home'
import NotFound from 'views/NotFound'

const routesConfig = [
  {
    //auto forward localhost:3002 to localhost:3002/home 
    exact: true,
    path: "/",
    component: ()=><Redirect to="/home"/>,
  },
  {
    exact: true,
    path: "/leadership",
    component: ()=><Redirect to="/leadership/top"/>,
  },
  {
    //try "http://localhost:3002/helloworld/123"
    exact: false,
    path: "/helloworld/:username",
    component: lazy(() => import("views/Helloworld")),
  },
  {
    exact: true,
    path: "/leadership/top",
    component: lazy(() => import("views/leadership/Top")),
  },
  {
    exact: true,
    path: "/leadership/myscore",
    component: lazy(() => import("views/leadership/SelfScore")),
  },
  //add more path ...
  {
    exact: true,
    path: "/gameplay/:roomId",
    component: lazy(() => import("views/Gameplay")),
  },

  //add more path
  {
    path: "*",
    routes: [
      {
        exact: true,
        path: "/home",
        component: Home,
      },
      {
        exact: true,
        path: "/404",
        component: NotFound,
      },
      {
        //anything that not match from "path" above will be route to "/404" 
        exact:true,
        path:"*",
        component: ()=><Redirect to="/404"/>,
      },
    ],
  },
  
];

const renderRoutes = (routes) =>
  routes ? (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;
          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
