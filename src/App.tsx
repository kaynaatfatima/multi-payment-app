import React, {lazy, Suspense} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Loading from "./pages/Loading";
import ErrorPage from "./pages/ErrorPage";
const ProviderSwitcher = lazy(() => import("./pages/ProviderSwitcher"))
const StripeCheckout = lazy(() => import("./providers/stripe/StripeCheckout"));
const Success = lazy(() => import("./pages/Success"));

const App: React.FC = () => {
  return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
              <Route path="/:apiKey" element={<ProviderSwitcher />}/>
              <Route path="/stripe-checkout" element={<StripeCheckout />} />
              <Route path="/error" element={<ErrorPage message=""/>} />
              <Route path="/success" element={<Success />} />
          </Routes>
        </Suspense>
      </Router>
  );
};

export default App;
