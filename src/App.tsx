import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import IDODetail from './pages/IDODetail';
import HomePage from './pages/Home';
import CreateIDO from './pages/CreateIDO';
function App() {
  return (
    <div className="flex flex-col min-h-screen bg-primary ">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-ido" element={<CreateIDO />} />
        <Route path="/ido/:poolAddress" element={<IDODetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
