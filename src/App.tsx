import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AuthWrapper from './components/Auth/AuthWrapper';
import { InvoiceProvider } from './context/InvoiceContext';
import Layout from './components/Layout';
import InvoiceForm from './components/InvoiceForm/InvoiceForm';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <InvoiceProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<InvoiceForm />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/products" element={<Products />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </InvoiceProvider>
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;