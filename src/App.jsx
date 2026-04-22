import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
    // De 'neon-container' en 'aurora' behouden de algemene sfeer van de pagina
    <div className="neon-container">
      <div className="aurora"></div>
      
      {/* We hebben de 'maintenance-card' div verwijderd om de achtergrond weg te halen */}
      <motion.main 
        className="logo-only-container" // Nieuwe classnaam voor specifieke styling indien nodig
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Zorgt ervoor dat het logo gecentreerd is op het scherm
          width: '100vw',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* --- ALLEEN LOGO (BEHOUDEN EN GECENTREERD) --- */}
        <motion.div 
          className="logo-wrapper"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Vervang de 'src' door je eigen logo bestand indien nodig */}
          <motion.img 
            src="/logo.png" 
            alt="TraceMyMovies Logo" 
            className="brand-logo"
            // We behouden de zweef-animatie
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              maxWidth: '200px', // Pas de grootte naar wens aan
              height: 'auto',
              display: 'block'
            }}
          />
        </motion.div>
        {/* ------------------------------- */}

      </motion.main>
    </div>
  );
}

export default App;