import React from "react";
import { CFade } from "@coreui/react";
import { Switch, Route, Redirect } from "react-router";
import { safeRoutes } from "../routes";

function SafeHOC() {
  return (
    <>
      <Redirect to="/login" />
      <Switch>
        {safeRoutes.map((route, idx) => {
          return (
            route.component && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={(props) => (
                  <CFade>
                    <route.component {...props} />
                  </CFade>
                )}
              />
            )
          );
        })}
      </Switch>
    </>
  );
}

export default SafeHOC;
