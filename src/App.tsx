import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Location from './pages/Location';
import Map from './pages/Map';
import SearchResults from './pages/SearchResults';
import RestaurantDetail from './pages/RestaurantDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/location" element={<Location />} />
        <Route path="/map" element={<Map />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
