import { motion } from 'framer-motion';
import './App.css';

function App() {
  // Animatie voor het hijsblokje
  const craneBlockVariants = {
    initial: { y: -300, x: 50 },
    animate: {
      y: [ -300, 0, 0, -300],
      x: [ 50, 50, 100, 100],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.4, 0.6, 1]
      }
    }
  };

  // Animatie voor de kraanarm
  const craneArmVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 0, 10, 10, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.4, 0.5, 0.6, 0.7]
      }
    }
  };

  return (
    <div className="construction-container">
      {/* Geanimeerde Parallax Achtergrond */}
      <motion.div 
        className="bg-pattern"
        animate={{ 
          backgroundPosition: ["0px 0px", "100px 100px"] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="overlay"></div>

      <motion.main 
        className="construction-window"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="window-header">
          <div className="danger-stripes"></div>
          <span className="header-title">ZONE_STATUS: ACTIVE_BUILD</span>
          <div className="danger-stripes"></div>
        </div>

        <div className="window-body">
          {/* Geanimeerde Kraan Scene */}
          <div className="crane-scene">
            <motion.div 
              className="crane-arm"
              variants={craneArmVariants}
              initial="initial"
              animate="animate"
            >
              <div className="arm-structure"></div>
              <div className="crane-cable"></div>
            </motion.div>
            <motion.div 
              className="crane-block"
              variants={craneBlockVariants}
              initial="initial"
              animate="animate"
            >
              <div className="block-symbol">🛠️</div>
            </motion.div>
            <div className="crane-base"></div>
          </div>

          <h1 className="title">Werken aan de weg</h1>
          
          <div className="description">
            <p>
              Hefboom, vijs en moer... we bouwen aan een <strong>betere</strong> ervaring.
            </p>
            <p className="sub-description">
              [ Verwachte voltooiing: <span className="highlight">Snel</span> ]
            </p>
          </div>

          {/* Waarschuwingsbord Loader */}
          <motion.div 
            className="warning-sign"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="sign-icon">⚠️</div>
            <div className="sign-text">WERK_IN_UITVOERING</div>
          </motion.div>
        </div>

        <div className="window-footer">
          <span>&copy; HEAVY_LIFTING_CORP // ZONE_ID: BUILD_9</span>
        </div>
      </motion.main>
    </div>
  );
}

export default App;