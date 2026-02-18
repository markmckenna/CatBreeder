import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>CatBreeder</h1>
      </header>
      <main className="app-main">
        <p>Welcome to your new React application!</p>
        <div className="counter">
          <button onClick={() => setCount((c) => c - 1)}>-</button>
          <span>{count}</span>
          <button onClick={() => setCount((c) => c + 1)}>+</button>
        </div>
      </main>
    </div>
  );
}

export default App;
