import App from "../App";
import { lazy } from "react";
import { LazyComponent } from "../componenets";

const Homepage = lazy(() => import('../pages/Homepage'));

export const routes = {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: (
                <LazyComponent>
                    <Homepage />
                </LazyComponent>
            ),
        },
        
    ]
}

