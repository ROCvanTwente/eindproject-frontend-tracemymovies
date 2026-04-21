import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <>
      <section id="center">
        <div className="hero">
          {/* We houden de visuals erin voor herkenbaarheid */}
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>Even geduld aub...</h1>
          <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
            Onze website ondergaat momenteel gepland <strong>onderhoud</strong>.
          </p>
          <p>
            We zijn snel weer terug met verbeteringen!
          </p>
        </div>

        {/* Een visuele indicator in plaats van een werkende knop */}
        <div className="counter" style={{ cursor: 'default', opacity: 0.8 }}>
          Status: Offline voor updates
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps" style={{ justifyContent: 'center' }}>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Blijf op de hoogte</h2>
          <p>Volg onze status via social media:</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App