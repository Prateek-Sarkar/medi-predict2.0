
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { DiseaseInfo } from './pages/DiseaseInfo';
import { ConditionDetail } from './pages/ConditionDetail';
import { Detection } from './pages/Detection';
import { Assistant } from './pages/Assistant';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="diseases" element={<DiseaseInfo />} />
          <Route path="diseases/:slug" element={<ConditionDetail />} />
          <Route path="detect" element={<Detection />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
