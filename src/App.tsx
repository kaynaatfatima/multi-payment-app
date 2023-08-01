import React, {lazy, Suspense} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Loading from "./pages/Loading";
import ErrorPage from "./pages/ErrorPage";

const ProviderSwitcher = lazy(() => import("./pages/ProviderSwitcher"));
const Success = lazy(() => import("./pages/Success"));

const StripeCheckout = lazy(() => import("./providers/stripe/StripeCheckout"));
const StripeEmbeddedCheckout = lazy(() => import("./providers/stripe/StripeEmbeddedCheckout"));

const App: React.FC = () => {
  return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
              <Route path="/payment" element={<ProviderSwitcher />}/>
              <Route path="/stripe-checkout" element={<StripeCheckout />} />
              <Route path="/stripe-em-checkout" element={<StripeEmbeddedCheckout />} />
              <Route path="/error" element={<ErrorPage message=""/>} />
              <Route path="/success" element={<Success />} />
          </Routes>
        </Suspense>
      </Router>
  );
};

export default App;
