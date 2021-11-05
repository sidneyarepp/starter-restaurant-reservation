import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TablesForm from './TablesForm';

function TablesRoutes() {
    return (
        <Switch>
            <Route to="/tables/new" exact>
                <TablesForm />
            </Route>
        </Switch>
    )
}

export default TablesRoutes;