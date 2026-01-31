import React, { useState } from 'react';

const ToggleSwitch = ({ variant, label, defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    setChecked(!checked);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="toggle-container">
      <label className="toggle-label">{label}</label>
      <div
        className={`toggle-switch ${variant} ${checked ? 'checked' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
      >
        <div className="toggle-track">
          <div className={`scene scene-${variant}`}>
            {variant === 'laboratory' && <LaboratoryScene checked={checked} />}
            {variant === 'periodic' && <PeriodicScene checked={checked} />}
            {variant === 'reaction' && <ReactionScene checked={checked} />}
            {variant === 'molecular' && <MolecularScene checked={checked} />}
            {variant === 'distillation' && <DistillationScene checked={checked} />}
            {variant === 'crystallization' && <CrystallizationScene checked={checked} />}
          </div>
          <div className="toggle-thumb">
            <div className="thumb-surface"></div>
            <div className="thumb-highlight"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Laboratory Scene
const LaboratoryScene = ({ checked }) => (
  <>
    {/* Table */}
    <div className="lab-table"></div>
    
    {/* Flask */}
    <div className={`flask ${checked ? 'filled' : ''}`}>
      <div className="flask-neck"></div>
      <div className="flask-body">
        <div className="liquid"></div>
        <div className="bubble b1"></div>
        <div className="bubble b2"></div>
        <div className="bubble b3"></div>
      </div>
    </div>
    
    {/* Burner */}
    <div className={`burner ${checked ? 'active' : ''}`}>
      <div className="burner-base"></div>
      <div className="flame"></div>
    </div>
    
    {/* Test tubes */}
    <div className="test-tube tube1">
      <div className="tube-liquid"></div>
    </div>
    <div className="test-tube tube2">
      <div className="tube-liquid"></div>
    </div>
    
    {/* Beaker */}
    <div className="beaker">
      <div className="beaker-liquid"></div>
      <div className="beaker-line l1"></div>
      <div className="beaker-line l2"></div>
    </div>
    
    {/* Shelf */}
    <div className="shelf"></div>
    
    {/* Books */}
    <div className="book b1"></div>
    <div className="book b2"></div>
    <div className="book b3"></div>
  </>
);

// Periodic Table Scene
const PeriodicScene = ({ checked }) => (
  <>
    {/* Animated background */}
    <div className="periodic-bg">
      <div className="energy-wave w1"></div>
      <div className="energy-wave w2"></div>
      <div className="energy-wave w3"></div>
    </div>
    
    {/* Periodic table grid with real element symbols */}
    <div className="periodic-grid">
      {['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg'].map((symbol, i) => (
        <div key={i} className={`element e${i} ${checked && i % 3 === 0 ? 'highlight' : ''}`}>
          <div className="element-number">{i + 1}</div>
          <div className="element-symbol">{symbol}</div>
          <div className="element-glow"></div>
        </div>
      ))}
    </div>
    
    {/* Enhanced atom model with protons and neutrons */}
    <div className={`atom-model ${checked ? 'active' : ''}`}>
      <div className="nucleus">
        <div className="proton p1"></div>
        <div className="proton p2"></div>
        <div className="neutron n1"></div>
        <div className="neutron n2"></div>
        <div className="nucleus-glow"></div>
      </div>
      <div className="orbit orbit1">
        <div className="electron e1">
          <div className="electron-trail"></div>
        </div>
      </div>
      <div className="orbit orbit2">
        <div className="electron e2">
          <div className="electron-trail"></div>
        </div>
        <div className="electron e3">
          <div className="electron-trail"></div>
        </div>
      </div>
      <div className="orbit orbit3">
        <div className="electron e4">
          <div className="electron-trail"></div>
        </div>
        <div className="electron e5">
          <div className="electron-trail"></div>
        </div>
      </div>
      {/* Quantum field effect */}
      <div className="quantum-field"></div>
    </div>
    
    {/* Electron shell indicators */}
    <div className={`shell-info ${checked ? 'visible' : ''}`}>
      <div className="shell-label l1">K</div>
      <div className="shell-label l2">L</div>
      <div className="shell-label l3">M</div>
    </div>
    
    {/* Floating atomic particles */}
    <div className="atomic-particles">
      <div className="particle ap1"></div>
      <div className="particle ap2"></div>
      <div className="particle ap3"></div>
      <div className="particle ap4"></div>
    </div>
  </>
);

// Chemical Reaction Scene
const ReactionScene = ({ checked }) => (
  <>
    {/* Background gradient */}
    <div className="reaction-bg"></div>
    
    {/* Left molecule */}
    <div className={`molecule-group left ${checked ? 'reacting' : ''}`}>
      <div className="atom a1"></div>
      <div className="atom a2"></div>
      <div className="bond b1"></div>
    </div>
    
    {/* Arrow */}
    <div className={`reaction-arrow ${checked ? 'active' : ''}`}>
      <div className="arrow-line"></div>
      <div className="arrow-head"></div>
    </div>
    
    {/* Right molecule */}
    <div className={`molecule-group right ${checked ? 'formed' : ''}`}>
      <div className="atom a3"></div>
      <div className="atom a4"></div>
      <div className="atom a5"></div>
      <div className="bond b2"></div>
      <div className="bond b3"></div>
    </div>
    
    {/* Energy particles */}
    <div className="energy-particles">
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
    </div>
  </>
);

// Molecular Structure Scene
const MolecularScene = ({ checked }) => (
  <>
    {/* DNA-like helix */}
    <div className={`helix ${checked ? 'active' : ''}`}>
      <div className="strand strand1">
        <div className="base b1"></div>
        <div className="base b2"></div>
        <div className="base b3"></div>
        <div className="base b4"></div>
      </div>
      <div className="strand strand2">
        <div className="base b1"></div>
        <div className="base b2"></div>
        <div className="base b3"></div>
        <div className="base b4"></div>
      </div>
      <div className="bond-pair bp1"></div>
      <div className="bond-pair bp2"></div>
      <div className="bond-pair bp3"></div>
    </div>
    
    {/* Molecular cloud */}
    <div className="mol-cloud c1"></div>
    <div className="mol-cloud c2"></div>
    <div className="mol-cloud c3"></div>
  </>
);

// Distillation Scene
const DistillationScene = ({ checked }) => (
  <>
    {/* Round bottom flask */}
    <div className={`round-flask ${checked ? 'heating' : ''}`}>
      <div className="flask-liquid">
        <div className="vapor v1"></div>
        <div className="vapor v2"></div>
        <div className="vapor v3"></div>
      </div>
    </div>
    
    {/* Connecting tube */}
    <div className="distill-tube">
      <div className={`vapor-flow ${checked ? 'flowing' : ''}`}></div>
    </div>
    
    {/* Condenser */}
    <div className="condenser">
      <div className="cooling-jacket"></div>
      <div className={`condensate ${checked ? 'dripping' : ''}`}></div>
    </div>
    
    {/* Collection flask */}
    <div className="collection-flask">
      <div className={`collected-liquid ${checked ? 'filling' : ''}`}></div>
    </div>
    
    {/* Heat source */}
    <div className={`heat-source ${checked ? 'on' : ''}`}>
      <div className="heat-wave w1"></div>
      <div className="heat-wave w2"></div>
      <div className="heat-wave w3"></div>
    </div>
  </>
);

// Crystallization Scene
const CrystallizationScene = ({ checked }) => (
  <>
    {/* Solution */}
    <div className={`solution ${checked ? 'crystallizing' : ''}`}>
      <div className="solution-surface"></div>
    </div>
    
    {/* Growing crystals */}
    <div className="crystal-formation">
      <div className={`crystal c1 ${checked ? 'grow' : ''}`}>
        <div className="facet f1"></div>
        <div className="facet f2"></div>
        <div className="facet f3"></div>
      </div>
      <div className={`crystal c2 ${checked ? 'grow' : ''}`}>
        <div className="facet f1"></div>
        <div className="facet f2"></div>
      </div>
      <div className={`crystal c3 ${checked ? 'grow' : ''}`}>
        <div className="facet f1"></div>
        <div className="facet f2"></div>
        <div className="facet f3"></div>
      </div>
      <div className={`crystal c4 ${checked ? 'grow' : ''}`}>
        <div className="facet f1"></div>
      </div>
    </div>
    
    {/* Petri dish */}
    <div className="petri-dish">
      <div className="dish-rim"></div>
      <div className="dish-base"></div>
    </div>
    
    {/* Sparkles */}
    <div className="sparkle s1"></div>
    <div className="sparkle s2"></div>
    <div className="sparkle s3"></div>
  </>
);

export default function App() {
  return (
    <div className="app">
      <div className="app-background">
        <div className="gradient-orb orb1"></div>
        <div className="gradient-orb orb2"></div>
        <div className="gradient-orb orb3"></div>
      </div>
      
      <div className="content">
        <header className="header">
          <h1>Chemistry Lab Switches</h1>
          <p className="subtitle">Illustrated Interactive Design</p>
        </header>

        <div className="toggles-grid">
          <ToggleSwitch variant="periodic" label="Light / Dark Theme" />
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
          position: relative;
          overflow: hidden;
        }

        .app-background {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          animation: floatOrb 25s infinite ease-in-out;
        }

        .orb1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #9fa8da, transparent);
          top: -100px;
          left: -100px;
        }

        .orb2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #81c784, transparent);
          bottom: -50px;
          right: -50px;
          animation-delay: -10s;
        }

        .orb3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #ffb74d, transparent);
          top: 40%;
          left: 50%;
          animation-delay: -5s;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .content {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 80px;
        }

        .header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #5e35b1, #1e88e5, #43a047, #fb8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .subtitle {
          color: #5e35b1;
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .toggles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 50px;
          padding: 20px;
        }

        .toggle-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .toggle-label {
          color: #5e35b1;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .toggle-switch {
          cursor: pointer;
          outline: none;
          transition: all 0.3s ease;
          filter: drop-shadow(0 10px 30px rgba(94, 53, 177, 0.2));
        }

        .toggle-switch:hover {
          filter: drop-shadow(0 15px 40px rgba(94, 53, 177, 0.3));
          transform: translateY(-2px);
        }

        .toggle-switch:focus-visible {
          outline: 3px solid #5e35b1;
          outline-offset: 8px;
          border-radius: 60px;
        }

        .toggle-track {
          width: 280px;
          height: 140px;
          border-radius: 70px;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          border: 4px solid #ffffff;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.12),
            inset 0 2px 8px rgba(255, 255, 255, 0.8),
            inset 0 -2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scene {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .toggle-thumb {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
          position: absolute;
          top: 16px;
          left: 20px;
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.15),
            inset 0 -3px 8px rgba(0, 0, 0, 0.1),
            inset 0 3px 8px rgba(255, 255, 255, 0.9);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
        }

        .toggle-switch.checked .toggle-thumb {
          left: 156px;
        }

        .thumb-surface {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          height: 90%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9), transparent 60%);
        }

        .thumb-highlight {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.95), transparent);
          filter: blur(3px);
        }

        /* ============ LABORATORY SCENE ============ */
        .scene-laboratory {
          background: linear-gradient(180deg, #e1f5fe 0%, #b3e5fc 40%, #dcedc8 70%, #c5e1a5 100%);
        }

        .lab-table {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 25px;
          background: linear-gradient(135deg, #8d6e63 0%, #a1887f 100%);
          border-top: 3px solid #6d4c41;
        }

        .flask {
          position: absolute;
          bottom: 25px;
          left: 140px;
          z-index: 10;
        }

        .flask-neck {
          width: 8px;
          height: 15px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(200, 230, 255, 0.5));
          margin: 0 auto;
          border: 1px solid rgba(100, 150, 200, 0.4);
          border-radius: 2px 2px 0 0;
        }

        .flask-body {
          width: 30px;
          height: 35px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(200, 230, 255, 0.6));
          border: 2px solid rgba(100, 150, 200, 0.5);
          border-radius: 0 0 15px 15px;
          position: relative;
          overflow: hidden;
        }

        .liquid {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
          transition: height 0.6s ease;
          border-radius: 0 0 13px 13px;
        }

        .flask.filled .liquid {
          height: 60%;
        }

        .bubble {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          opacity: 0;
        }

        .flask.filled .bubble {
          animation: bubble 2s infinite ease-in;
        }

        .b1 { bottom: 2px; left: 8px; animation-delay: 0s; }
        .b2 { bottom: 2px; left: 16px; animation-delay: 0.5s; }
        .b3 { bottom: 2px; left: 20px; animation-delay: 1s; }

        @keyframes bubble {
          0% { bottom: 2px; opacity: 0; }
          20% { opacity: 1; }
          100% { bottom: 55%; opacity: 0; }
        }

        .burner {
          position: absolute;
          bottom: 0;
          left: 130px;
          z-index: 5;
        }

        .burner-base {
          width: 50px;
          height: 12px;
          background: linear-gradient(135deg, #424242 0%, #616161 100%);
          border-radius: 2px;
          border: 1px solid #212121;
        }

        .flame {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 0;
          background: radial-gradient(ellipse at bottom, #ff6f00 0%, #ff9800 40%, #ffeb3b 80%, transparent 100%);
          border-radius: 50% 50% 0 0;
          opacity: 0;
          transition: all 0.4s ease;
          filter: blur(1px);
        }

        .burner.active .flame {
          height: 25px;
          opacity: 1;
          animation: flicker 0.3s infinite alternate;
        }

        @keyframes flicker {
          0% { transform: translateX(-50%) scaleY(1); }
          100% { transform: translateX(-50%) scaleY(1.1); }
        }

        .test-tube {
          position: absolute;
          bottom: 25px;
          width: 8px;
          height: 28px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(200, 230, 255, 0.6));
          border: 1px solid rgba(100, 150, 200, 0.5);
          border-radius: 0 0 4px 4px;
        }

        .tube1 { left: 45px; }
        .tube2 { left: 60px; }

        .tube-liquid {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
          border-radius: 0 0 3px 3px;
        }

        .beaker {
          position: absolute;
          bottom: 25px;
          left: 200px;
          width: 24px;
          height: 30px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(200, 230, 255, 0.5));
          border: 2px solid rgba(100, 150, 200, 0.5);
          border-radius: 0 0 3px 3px;
          position: relative;
        }

        .beaker-liquid {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 60%;
          background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
          border-radius: 0 0 2px 2px;
        }

        .beaker-line {
          position: absolute;
          left: 2px;
          width: calc(100% - 4px);
          height: 1px;
          background: rgba(100, 150, 200, 0.3);
        }

        .l1 { bottom: 40%; }
        .l2 { bottom: 60%; }

        .shelf {
          position: absolute;
          top: 25px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(135deg, #8d6e63 0%, #a1887f 100%);
        }

        .book {
          position: absolute;
          top: 14px;
          width: 12px;
          height: 13px;
          border-radius: 1px;
        }

        .b1 { left: 150px; background: linear-gradient(135deg, #e57373 0%, #ef5350 100%); }
        .b2 { left: 165px; background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%); }
        .b3 { left: 180px; background: linear-gradient(135deg, #81c784 0%, #66bb6a 100%); }

        /* ============ PERIODIC TABLE SCENE ============ */
        /* Light Theme (unchecked) */
        .scene-periodic {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 40%, #90caf9 70%, #64b5f6 100%);
          position: relative;
          overflow: visible;
          transition: background 0.6s ease;
        }

        /* Dark Theme (checked) */
        .periodic.checked .scene-periodic {
          background: linear-gradient(135deg, #0a0e27 0%, #1a237e 40%, #283593 70%, #3949ab 100%);
        }

        .periodic-bg {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .energy-wave {
          position: absolute;
          width: 100%;
          height: 30px;
          background: radial-gradient(ellipse at center, rgba(255, 193, 7, 0.1), transparent 70%);
          border-radius: 50%;
          opacity: 0;
          animation: energyPulse 4s infinite ease-in-out;
        }

        .periodic.checked .energy-wave {
          background: radial-gradient(ellipse at center, rgba(255, 193, 7, 0.2), transparent 70%);
        }

        .w1 { top: 20%; animation-delay: 0s; }
        .w2 { top: 50%; animation-delay: 1.3s; }
        .w3 { top: 80%; animation-delay: 2.6s; }

        @keyframes energyPulse {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.4; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }

        .periodic-grid {
          position: absolute;
          top: 12px;
          left: 12px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
          width: 148px;
          z-index: 5;
        }

        /* Light Theme Elements */
        .element {
          width: 22px;
          height: 24px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          border: 1px solid rgba(100, 181, 246, 0.4);
          border-radius: 3px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Dark Theme Elements */
        .periodic.checked .element {
          background: linear-gradient(135deg, rgba(63, 81, 181, 0.4), rgba(48, 63, 159, 0.3));
          border: 1px solid rgba(121, 134, 203, 0.4);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .element::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: rotate(45deg);
          transition: all 0.5s;
        }

        .element:hover::before {
          left: 100%;
        }

        .element.highlight {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.8), rgba(255, 152, 0, 0.7));
          border-color: rgba(255, 193, 7, 1);
          box-shadow: 
            0 0 12px rgba(255, 193, 7, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .element-number {
          position: absolute;
          top: 1px;
          left: 2px;
          font-size: 5px;
          color: rgba(33, 33, 33, 0.6);
          font-weight: 600;
          transition: color 0.4s ease;
        }

        .periodic.checked .element-number {
          color: rgba(255, 255, 255, 0.5);
        }

        .element.highlight .element-number {
          color: rgba(255, 255, 255, 0.9);
        }

        .element-symbol {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 8px;
          font-weight: 700;
          color: rgba(33, 33, 33, 0.9);
          text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
          transition: color 0.4s ease, text-shadow 0.4s ease;
        }

        .periodic.checked .element-symbol {
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 0 4px rgba(100, 181, 246, 0.5);
        }

        .element.highlight .element-symbol {
          color: #ffffff;
          text-shadow: 0 0 8px rgba(255, 193, 7, 1);
        }

        .element-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(100, 181, 246, 0.3), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .element:hover .element-glow {
          opacity: 1;
        }

        .atom-model {
          position: absolute;
          right: 25px;
          top: 35px;
          width: 80px;
          height: 80px;
          z-index: 10;
        }

        .nucleus {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
          z-index: 20;
        }

        .proton, .neutron {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: nucleusVibrate 2s infinite ease-in-out;
          transition: all 0.4s ease;
        }

        /* Light Theme - brighter nucleus particles */
        .proton {
          background: radial-gradient(circle at 35% 35%, #ff8f00 0%, #ff6f00 100%);
          box-shadow: 
            0 0 8px rgba(255, 143, 0, 0.8),
            inset 1px 1px 2px rgba(255, 255, 255, 0.4);
        }

        .neutron {
          background: radial-gradient(circle at 35% 35%, #90a4ae 0%, #78909c 100%);
          box-shadow: 
            0 0 6px rgba(144, 164, 174, 0.6),
            inset 1px 1px 2px rgba(255, 255, 255, 0.3);
        }

        /* Dark Theme - glowing nucleus particles */
        .periodic.checked .proton {
          background: radial-gradient(circle at 35% 35%, #ff6f00 0%, #e65100 100%);
          box-shadow: 
            0 0 12px rgba(255, 111, 0, 1),
            inset 1px 1px 2px rgba(255, 255, 255, 0.3);
        }

        .periodic.checked .neutron {
          background: radial-gradient(circle at 35% 35%, #78909c 0%, #546e7a 100%);
          box-shadow: 
            0 0 8px rgba(120, 144, 156, 0.8),
            inset 1px 1px 2px rgba(255, 255, 255, 0.2);
        }

        .p1 { top: 2px; left: 2px; animation-delay: 0s; }
        .p2 { top: 8px; left: 8px; animation-delay: 0.5s; }
        .n1 { top: 2px; left: 8px; animation-delay: 0.25s; }
        .n2 { top: 8px; left: 2px; animation-delay: 0.75s; }

        @keyframes nucleusVibrate {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(0.5px, -0.5px); }
          50% { transform: translate(-0.5px, 0.5px); }
          75% { transform: translate(0.5px, 0.5px); }
        }

        .nucleus-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: radial-gradient(circle, rgba(255, 143, 0, 0.3), transparent 70%);
          border-radius: 50%;
          animation: nucleusGlow 2s infinite ease-in-out;
          transition: background 0.4s ease;
        }

        .periodic.checked .nucleus-glow {
          background: radial-gradient(circle, rgba(255, 111, 0, 0.5), transparent 70%);
        }

        @keyframes nucleusGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
        }

        /* Light Theme - subtle orbits */
        .orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1.5px solid rgba(33, 150, 243, 0.3);
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(33, 150, 243, 0.2);
          transition: all 0.4s ease;
        }

        /* Dark Theme - glowing orbits */
        .periodic.checked .orbit {
          border-color: rgba(100, 181, 246, 0.4);
          box-shadow: 0 0 8px rgba(100, 181, 246, 0.3);
        }

        .orbit1 {
          width: 35px;
          height: 35px;
          animation: rotateOrbit 4s linear infinite;
        }

        .orbit2 {
          width: 55px;
          height: 55px;
          animation: rotateOrbit 6s linear infinite;
        }

        .orbit3 {
          width: 75px;
          height: 75px;
          animation: rotateOrbit 8s linear infinite;
        }

        .atom-model.active .orbit {
          border-width: 2px;
        }

        .atom-model.active .orbit {
          border-color: rgba(33, 150, 243, 0.6);
          box-shadow: 
            0 0 12px rgba(33, 150, 243, 0.4),
            inset 0 0 8px rgba(33, 150, 243, 0.1);
        }

        .periodic.checked .atom-model.active .orbit {
          border-color: rgba(100, 181, 246, 0.7);
          box-shadow: 
            0 0 15px rgba(100, 181, 246, 0.6),
            inset 0 0 10px rgba(100, 181, 246, 0.2);
        }

        .atom-model.active .orbit1 {
          animation-duration: 2s;
        }

        .atom-model.active .orbit2 {
          animation-duration: 3s;
        }

        .atom-model.active .orbit3 {
          animation-duration: 4s;
        }

        @keyframes rotateOrbit {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Light Theme - bright electrons */
        .electron {
          position: absolute;
          width: 7px;
          height: 7px;
          background: radial-gradient(circle at 35% 35%, #64b5f6 0%, #2196f3 100%);
          border-radius: 50%;
          box-shadow: 
            0 0 8px rgba(33, 150, 243, 0.8),
            inset 1px 1px 2px rgba(255, 255, 255, 0.5);
          z-index: 15;
          transition: all 0.4s ease;
        }

        /* Dark Theme - glowing electrons */
        .periodic.checked .electron {
          background: radial-gradient(circle at 35% 35%, #64b5f6 0%, #1e88e5 100%);
          box-shadow: 
            0 0 12px rgba(100, 181, 246, 1),
            inset 1px 1px 2px rgba(255, 255, 255, 0.5);
        }

        .electron-trail {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: radial-gradient(circle, rgba(33, 150, 243, 0.3), transparent 60%);
          border-radius: 50%;
          animation: trailPulse 1s infinite ease-out;
          transition: background 0.4s ease;
        }

        .periodic.checked .electron-trail {
          background: radial-gradient(circle, rgba(100, 181, 246, 0.4), transparent 60%);
        }

        @keyframes trailPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        .e1 {
          top: -3.5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .e2 {
          top: -3.5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .e3 {
          top: auto;
          bottom: -3.5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .e4 {
          top: -3.5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .e5 {
          top: 50%;
          right: -3.5px;
          transform: translateY(-50%);
        }

        .atom-model.active .electron {
          animation: electronGlow 1s infinite ease-in-out;
        }

        .periodic.checked .atom-model.active .electron {
          box-shadow: 
            0 0 15px rgba(100, 181, 246, 1),
            0 0 25px rgba(100, 181, 246, 0.6),
            inset 1px 1px 2px rgba(255, 255, 255, 0.6);
        }

        @keyframes electronGlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .quantum-field {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90px;
          height: 90px;
          background: radial-gradient(circle, rgba(33, 150, 243, 0.05), transparent 70%);
          border-radius: 50%;
          opacity: 0;
          animation: quantumField 3s infinite ease-in-out;
          transition: background 0.4s ease;
        }

        .periodic.checked .quantum-field {
          background: radial-gradient(circle, rgba(186, 104, 200, 0.15), transparent 70%);
        }

        .atom-model.active .quantum-field {
          opacity: 1;
        }

        @keyframes quantumField {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9) rotate(0deg); }
          50% { transform: translate(-50%, -50%) scale(1.1) rotate(180deg); }
        }

        .shell-info {
          position: absolute;
          right: 15px;
          top: 30px;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.5s ease;
        }

        .shell-info.visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* Light Theme labels */
        .shell-label {
          font-size: 7px;
          font-weight: 700;
          color: rgba(255, 152, 0, 0.9);
          margin-bottom: 14px;
          text-shadow: 0 0 4px rgba(255, 152, 0, 0.4);
          padding: 2px 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 2px;
          border: 1px solid rgba(255, 152, 0, 0.5);
          transition: all 0.4s ease;
        }

        /* Dark Theme labels */
        .periodic.checked .shell-label {
          color: rgba(255, 193, 7, 0.9);
          text-shadow: 0 0 6px rgba(255, 193, 7, 0.6);
          background: rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 193, 7, 0.4);
        }

        .l1 { animation: labelBlink 2s infinite ease-in-out; animation-delay: 0s; }
        .l2 { animation: labelBlink 2s infinite ease-in-out; animation-delay: 0.3s; }
        .l3 { animation: labelBlink 2s infinite ease-in-out; animation-delay: 0.6s; }

        @keyframes labelBlink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .atomic-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Light Theme particles */
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, rgba(255, 152, 0, 0.6), transparent);
          border-radius: 50%;
          animation: particleDrift 6s infinite ease-in-out;
          transition: background 0.4s ease;
        }

        /* Dark Theme particles */
        .periodic.checked .particle {
          background: radial-gradient(circle, rgba(255, 193, 7, 0.8), transparent);
        }

        .ap1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .ap2 {
          top: 70%;
          left: 20%;
          animation-delay: 1.5s;
        }

        .ap3 {
          top: 40%;
          right: 15%;
          animation-delay: 3s;
        }

        .ap4 {
          bottom: 20%;
          right: 25%;
          animation-delay: 4.5s;
        }

        @keyframes particleDrift {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% {
            transform: translate(10px, -10px);
            opacity: 0.8;
          }
          50% {
            transform: translate(5px, -20px);
            opacity: 1;
          }
          75% {
            transform: translate(-5px, -10px);
            opacity: 0.6;
          }
        }

        /* ============ REACTION SCENE ============ */
        .scene-reaction {
          background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #ffccbc 100%);
        }

        .reaction-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3), transparent 60%);
        }

        .molecule-group {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .molecule-group.left {
          left: 30px;
        }

        .molecule-group.left.reacting {
          left: 80px;
          opacity: 0.3;
          transform: translateY(-50%) scale(0.8);
        }

        .molecule-group.right {
          right: 30px;
          opacity: 0;
          transform: translateY(-50%) scale(0.5);
        }

        .molecule-group.right.formed {
          opacity: 1;
          transform: translateY(-50%) scale(1);
        }

        .atom {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          position: absolute;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        }

        .a1 {
          background: radial-gradient(circle at 35% 35%, #e57373, #ef5350);
          top: 0;
          left: 0;
        }

        .a2 {
          background: radial-gradient(circle at 35% 35%, #64b5f6, #42a5f5);
          top: 0;
          left: 25px;
        }

        .a3 {
          background: radial-gradient(circle at 35% 35%, #81c784, #66bb6a);
          top: 0;
          left: 0;
        }

        .a4 {
          background: radial-gradient(circle at 35% 35%, #ffd54f, #ffca28);
          top: 0;
          left: 25px;
        }

        .a5 {
          background: radial-gradient(circle at 35% 35%, #ba68c8, #ab47bc);
          top: 25px;
          left: 12px;
        }

        .bond {
          position: absolute;
          height: 3px;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3));
          border-radius: 2px;
        }

        .b1 {
          width: 20px;
          top: 8px;
          left: 10px;
        }

        .b2 {
          width: 20px;
          top: 8px;
          left: 10px;
        }

        .b3 {
          width: 3px;
          height: 20px;
          top: 10px;
          left: 20px;
          transform: rotate(60deg);
        }

        .reaction-arrow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .reaction-arrow.active {
          opacity: 1;
        }

        .arrow-line {
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #ff6f00 0%, #ff9800 100%);
          border-radius: 2px;
        }

        .arrow-head {
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid #ff9800;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
        }

        .energy-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ffeb3b, #ffc107);
          border-radius: 50%;
          opacity: 0;
        }

        .reaction-arrow.active ~ .energy-particles .particle {
          animation: particleFloat 1.5s ease-out forwards;
        }

        .p1 { top: 40%; left: 45%; animation-delay: 0s; }
        .p2 { top: 50%; left: 48%; animation-delay: 0.2s; }
        .p3 { top: 55%; left: 52%; animation-delay: 0.4s; }
        .p4 { top: 45%; left: 55%; animation-delay: 0.6s; }

        @keyframes particleFloat {
          0% { opacity: 0; transform: translate(0, 0) scale(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--x, 20px), var(--y, -20px)) scale(1.5); }
        }

        /* ============ MOLECULAR HELIX SCENE ============ */
        .scene-molecular {
          background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #9fa8da 100%);
        }

        .helix {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 80px;
        }

        .strand {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .strand1 {
          animation: twist 4s linear infinite;
        }

        .strand2 {
          animation: twist 4s linear infinite reverse;
        }

        .helix.active .strand1,
        .helix.active .strand2 {
          animation-duration: 2s;
        }

        @keyframes twist {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .base {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
        }

        .strand1 .b1 { background: radial-gradient(circle, #e57373, #ef5350); top: 10%; left: 0; }
        .strand1 .b2 { background: radial-gradient(circle, #64b5f6, #42a5f5); top: 35%; left: 10%; }
        .strand1 .b3 { background: radial-gradient(circle, #81c784, #66bb6a); top: 60%; left: 0; }
        .strand1 .b4 { background: radial-gradient(circle, #ffd54f, #ffca28); top: 85%; left: 10%; }

        .strand2 .b1 { background: radial-gradient(circle, #ba68c8, #ab47bc); top: 10%; right: 0; }
        .strand2 .b2 { background: radial-gradient(circle, #ff8a65, #ff7043); top: 35%; right: 10%; }
        .strand2 .b3 { background: radial-gradient(circle, #4dd0e1, #26c6da); top: 60%; right: 0; }
        .strand2 .b4 { background: radial-gradient(circle, #aed581, #9ccc65); top: 85%; right: 10%; }

        .bond-pair {
          position: absolute;
          left: 20%;
          right: 20%;
          height: 2px;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
        }

        .bp1 { top: 15%; }
        .bp2 { top: 40%; }
        .bp3 { top: 65%; }

        .mol-cloud {
          position: absolute;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent 60%);
          border-radius: 50%;
          opacity: 0.5;
          animation: cloudFloat 6s infinite ease-in-out;
        }

        .c1 { width: 40px; height: 40px; top: 10%; left: 5%; }
        .c2 { width: 50px; height: 50px; bottom: 15%; right: 10%; animation-delay: 2s; }
        .c3 { width: 35px; height: 35px; top: 60%; right: 20%; animation-delay: 4s; }

        @keyframes cloudFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }

        /* ============ DISTILLATION SCENE ============ */
        .scene-distillation {
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffccbc 100%);
        }

        .round-flask {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 240, 230, 0.5));
          border: 2px solid rgba(255, 152, 0, 0.3);
          border-radius: 50%;
          overflow: hidden;
        }

        .flask-liquid {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 60%;
          background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
          border-radius: 0 0 50% 50%;
        }

        .vapor {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          opacity: 0;
        }

        .round-flask.heating .vapor {
          animation: vaporRise 1.5s infinite ease-in;
        }

        .v1 { bottom: 60%; left: 30%; animation-delay: 0s; }
        .v2 { bottom: 60%; left: 50%; animation-delay: 0.5s; }
        .v3 { bottom: 60%; left: 60%; animation-delay: 1s; }

        @keyframes vaporRise {
          0% { bottom: 60%; opacity: 0; transform: scale(1); }
          50% { opacity: 1; }
          100% { bottom: 95%; opacity: 0; transform: scale(0.3); }
        }

        .distill-tube {
          position: absolute;
          bottom: 50px;
          left: 50px;
          width: 80px;
          height: 3px;
          background: linear-gradient(to right, rgba(200, 200, 200, 0.5), rgba(220, 220, 220, 0.6));
          border: 1px solid rgba(150, 150, 150, 0.4);
          transform: rotate(-10deg);
        }

        .vapor-flow {
          position: absolute;
          width: 0;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.3), transparent);
          transition: width 0.8s ease;
        }

        .vapor-flow.flowing {
          width: 100%;
        }

        .condenser {
          position: absolute;
          bottom: 45px;
          right: 70px;
          width: 25px;
          height: 40px;
          background: linear-gradient(to right, rgba(200, 230, 255, 0.3), rgba(220, 240, 255, 0.4));
          border: 2px solid rgba(100, 150, 200, 0.4);
          border-radius: 3px;
        }

        .cooling-jacket {
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          height: 60%;
          background: repeating-linear-gradient(
            0deg,
            rgba(100, 181, 246, 0.2) 0px,
            rgba(100, 181, 246, 0.2) 2px,
            transparent 2px,
            transparent 4px
          );
        }

        .condensate {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 0;
          background: linear-gradient(180deg, #64b5f6, #42a5f5);
          border-radius: 2px;
          transition: height 0.8s ease;
        }

        .condensate.dripping {
          height: 80%;
          animation: drip 2s infinite ease-in;
        }

        @keyframes drip {
          0%, 90% { height: 80%; }
          95% { height: 85%; }
          100% { height: 80%; }
        }

        .collection-flask {
          position: absolute;
          bottom: 15px;
          right: 60px;
          width: 30px;
          height: 30px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(220, 240, 255, 0.5));
          border: 2px solid rgba(100, 150, 200, 0.4);
          border-radius: 0 0 15px 15px;
          overflow: hidden;
        }

        .collected-liquid {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 0;
          background: linear-gradient(135deg, #42a5f5 0%, #64b5f6 100%);
          transition: height 1s ease;
          border-radius: 0 0 13px 13px;
        }

        .collected-liquid.filling {
          height: 50%;
        }

        .heat-source {
          position: absolute;
          bottom: 0;
          left: 15px;
          width: 50px;
          height: 8px;
          background: linear-gradient(135deg, #424242 0%, #616161 100%);
          border-radius: 2px;
        }

        .heat-wave {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(255, 111, 0, 0.3), transparent);
          border-radius: 50%;
          opacity: 0;
        }

        .heat-source.on .heat-wave {
          animation: heatWave 1s infinite ease-in-out;
        }

        .w1 { animation-delay: 0s; }
        .w2 { animation-delay: 0.3s; }
        .w3 { animation-delay: 0.6s; }

        @keyframes heatWave {
          0% { bottom: 8px; opacity: 0; width: 30px; }
          50% { opacity: 0.6; }
          100% { bottom: 25px; opacity: 0; width: 40px; }
        }

        /* ============ CRYSTALLIZATION SCENE ============ */
        .scene-crystallization {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
        }

        .solution {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(100, 181, 246, 0.2), rgba(100, 181, 246, 0.3));
          transition: all 0.8s ease;
        }

        .solution.crystallizing {
          background: linear-gradient(135deg, rgba(100, 181, 246, 0.1), rgba(100, 181, 246, 0.15));
        }

        .solution-surface {
          position: absolute;
          top: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, 
            rgba(100, 181, 246, 0.4), 
            rgba(100, 181, 246, 0.6), 
            rgba(100, 181, 246, 0.4)
          );
          border-radius: 50%;
          animation: surfaceTension 3s infinite ease-in-out;
        }

        @keyframes surfaceTension {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.05); }
        }

        .crystal-formation {
          position: absolute;
          bottom: 35px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 80px;
        }

        .crystal {
          position: absolute;
          opacity: 0;
          transform: scale(0) rotate(0deg);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .crystal.grow {
          opacity: 1;
          transform: scale(1) rotate(var(--rotate, 0deg));
        }

        .c1 {
          bottom: 10px;
          left: 35px;
          --rotate: 20deg;
          transition-delay: 0.2s;
        }

        .c2 {
          bottom: 15px;
          left: 55px;
          --rotate: -15deg;
          transition-delay: 0.4s;
        }

        .c3 {
          bottom: 8px;
          left: 20px;
          --rotate: 35deg;
          transition-delay: 0.6s;
        }

        .c4 {
          bottom: 20px;
          left: 70px;
          --rotate: -25deg;
          transition-delay: 0.8s;
        }

        .facet {
          position: absolute;
          background: linear-gradient(135deg, rgba(100, 181, 246, 0.8), rgba(100, 181, 246, 0.6));
          border: 1px solid rgba(100, 181, 246, 1);
        }

        .c1 .f1 {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 14px solid rgba(100, 181, 246, 0.8);
          background: none;
          border: none;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 14px solid #64b5f6;
        }

        .c1 .f2 {
          width: 16px;
          height: 2px;
          background: rgba(255, 255, 255, 0.8);
          position: absolute;
          top: 8px;
          left: 0;
        }

        .c1 .f3 {
          width: 2px;
          height: 10px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), transparent);
          position: absolute;
          top: 2px;
          left: 7px;
        }

        .c2 .f1 {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid #64b5f6;
          background: none;
          border: none;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid #64b5f6;
        }

        .c2 .f2 {
          width: 12px;
          height: 1px;
          background: rgba(255, 255, 255, 0.7);
          position: absolute;
          top: 5px;
          left: 0;
        }

        .c3 .f1 {
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 12px solid #64b5f6;
          background: none;
          border: none;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 12px solid #64b5f6;
        }

        .c3 .f2 {
          width: 14px;
          height: 1px;
          background: rgba(255, 255, 255, 0.8);
          position: absolute;
          top: 6px;
          left: 0;
        }

        .c3 .f3 {
          width: 1px;
          height: 8px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), transparent);
          position: absolute;
          top: 2px;
          left: 6px;
        }

        .c4 .f1 {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 8px solid #64b5f6;
          background: none;
          border: none;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 8px solid #64b5f6;
        }

        .petri-dish {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          width: 130px;
          height: 60px;
        }

        .dish-rim {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(to bottom, rgba(200, 200, 200, 0.4), rgba(220, 220, 220, 0.6));
          border-radius: 50%;
          border: 1px solid rgba(150, 150, 150, 0.3);
        }

        .dish-base {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to bottom, rgba(180, 180, 180, 0.5), rgba(200, 200, 200, 0.7));
          border-radius: 50%;
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ffffff, transparent);
          border-radius: 50%;
          opacity: 0;
          animation: sparkle 2s infinite ease-in-out;
        }

        .s1 {
          bottom: 45px;
          left: 45%;
          animation-delay: 0s;
        }

        .s2 {
          bottom: 55px;
          left: 55%;
          animation-delay: 0.7s;
        }

        .s3 {
          bottom: 50px;
          left: 50%;
          animation-delay: 1.4s;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2.5rem;
          }

          .toggles-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .toggle-track {
            width: 260px;
            height: 130px;
          }

          .toggle-thumb {
            width: 90px;
            height: 90px;
          }

          .toggle-switch.checked .toggle-thumb {
            left: 146px;
          }
        }
      `}</style>
    </div>
  );
}
