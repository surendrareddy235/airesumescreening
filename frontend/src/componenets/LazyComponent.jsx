import { Suspense } from "react";
import { Loader } from "./";

export const LazyComponent = ({ children }) => (
    <Suspense fallback={<Loader />}>
        {children}
    </Suspense>
);
