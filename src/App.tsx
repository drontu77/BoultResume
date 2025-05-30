import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ResumeBuilder from './pages/ResumeBuilder';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import { ResumeProvider } from './contexts/ResumeContext';
import { TemplateProvider } from './contexts/TemplateContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <ResumeProvider>
        <TemplateProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardWrapper />} />
              <Route path="/resume/:resumeId" element={<ResumeBuilderWrapper />} />
              <Route path="/resume/new" element={<ResumeBuilderWrapper isNew={true} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </TemplateProvider>
      </ResumeProvider>
    </div>
  );
}

// Wrapper components to provide navigation functionality
function DashboardWrapper() {
  const navigate = useNavigate();
  
  const handleResumeEdit = (resumeId: string) => {
    navigate(`/resume/${resumeId}`);
  };
  
  const handleCreateNewResume = () => {
    navigate('/resume/new');
  };
  
  return (
    <Dashboard 
      onResumeEdit={handleResumeEdit}
      onCreateNewResume={handleCreateNewResume}
    />
  );
}

function ResumeBuilderWrapper({ isNew = false }: { isNew?: boolean }) {
  const navigate = useNavigate();
  
  const handleDashboardClick = () => {
    navigate('/');
  };
  
  return <ResumeBuilder onDashboardClick={handleDashboardClick} isNewResume={isNew} />;
}

export default App;