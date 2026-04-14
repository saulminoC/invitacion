import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Papas from './papas.tsx' // Importamos tu nueva vista

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* La ruta principal (localhost:5173) muestra la invitación */}
        <Route path="/" element={<App />} />
        
        {/* La nueva ruta (localhost:5173/papas) muestra el panel */}
        <Route path="/papas" element={<Papas />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)