import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Policies from "./pages/Policies";
import { CartProvider } from "./contexts/CartContext";
import CookieBanner from "./components/CookieBanner";
import GlobalCartDrawer from "./components/GlobalCartDrawer";
import PaymentStatus from "./pages/PaymentStatus";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:slug" component={ProductPage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/:status" component={PaymentStatus} />
      <Route path="/policies" component={Policies} />
      <Route path="/privacy" component={Policies} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Router />
            <CookieBanner />
            <GlobalCartDrawer />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
