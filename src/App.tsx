import './styles.css';
import { LogoHeader } from './components/LogoHeader';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <div className="App">
      <div className="container">
        <LogoHeader />
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </div>
  );
}

export default App;
