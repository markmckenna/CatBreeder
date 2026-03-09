import { GameProvider } from './ui/game/GameContext.tsx';
import GameUI from './ui/GameUI';

function App() {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
}

export default App;
