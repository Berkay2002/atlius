import './App.css';
import { HashRouter, Routes, Route} from "react-router-dom";
import SearchRoom from './SearchRoom.js';
import LocationDetails from './LocationDetails';
import ErrorBoundary from './ErrorBoundary';
import NotFound from './NotFound';

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<SearchRoom />}/>
          <Route path="/map/:roomName" element={<LocationDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </HashRouter>
 );
}

export default App;
