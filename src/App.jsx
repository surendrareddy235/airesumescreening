
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from "./pages/HomePage";
import './App.css'

// Create the QueryClient instance
const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
