import LayersView from "./view/LayersView";
import Statistics from "./view/Statistics";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';



export default function App() {

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Layers</Link> |{" "}
        <Link to="/statistics">Statistics</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LayersView />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  )
}
