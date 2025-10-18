import { useState, useEffect } from 'react';
import BlockOverlay from './components/BlockOverlay';
import { startBlocking, stopBlocking, setWhitelist, isBlocked } from './utils/blocker';

function App() {
  const [activeApp, setActiveApp] = useState(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    // pretend to monitor user focus
    const interval = setInterval(() => {
      const fakeApp = document.title; // or current section name
      if (isBlocked(fakeApp)) setBlocked(true);
      else setBlocked(false);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (blocked) return <BlockOverlay appName={activeApp} />;
  return (
    <div>
      <h1>Focus Mode</h1>
      <button onClick={() => startBlocking()}>Start</button>
      <button onClick={() => stopBlocking()}>Stop</button>
      <button onClick={() => setWhitelist(['Notes', 'FocusForge'])}>Whitelist Notes</button>
    </div>
  );
}

export default App;
