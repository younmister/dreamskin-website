import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProfileSelection } from './pages/ProfileSelection';
import { Dashboard } from './pages/Dashboard';
import { ClientInfo } from './pages/ClientInfo';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { Summary } from './pages/Summary';
import { ClientList } from './pages/ClientList';
import { ClientProfile } from './pages/ClientProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfileSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/client-info" element={<ClientInfo />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/client/:clientId" element={<ClientProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
