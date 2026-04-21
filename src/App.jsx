import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
    <div className="neon-container">
      {/* Geanimeerde achtergrond gloed */}
      <div className="aurora"></div>
      
      <motion.main 
        className="maintenance-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="status-header">
          <motion.div 
            className="pulse-ring"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="status-dot"></div>
          <span className="status-text">UNDER_MAINTENANCE</span>
        </div>

        <h1 className="main-title">
          Bezig met <span className="text-primary">onderhoud</span>
        </h1>

        <div className="dna-visual">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="dna-bar"
              animate={{ 
                height: [20, 60, 20],
                backgroundColor: ["#BFBCFC", "#44FFFF", "#FF61D2", "#BFBCFC"]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </div>

        <p className="description">
          We werken aan de <strong>website</strong> kom later terug.
        </p>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">STATUS</span>
            <span className="stat-value text-accent">offline</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">OWNED BY</span>
            <span className="stat-value text-secondary">TraceMyMovies</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="#" className="link-hover">GitHub</a>
          <a href="#" className="link-hover">X.com</a>
        </div>
      </motion.main>
    </div>
  );
}

export default App;