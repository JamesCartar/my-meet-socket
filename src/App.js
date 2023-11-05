import {Routes, Route } from 'react-router-dom';


import LandingPage from "./pages/LandingPage";
import NotFound from './pages/notFound/NotFound';
import SampleRoom from './pages/SampleRoom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/rooms/:roomId" element={<SampleRoom />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
