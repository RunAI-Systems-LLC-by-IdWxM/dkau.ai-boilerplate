import { useState, useEffect } from 'react';

export function usePlayerControls() {
  const [movement, setMovement] = useState({
    forward: false, backward: false, left: false, right: false, jump: false, action: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.code === 'Space') e.preventDefault(); 
      
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': setMovement(m => ({ ...m, forward: true })); break;
        case 'KeyS': case 'ArrowDown': setMovement(m => ({ ...m, backward: true })); break;
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({ ...m, left: true })); break;
        case 'KeyD': case 'ArrowRight': setMovement(m => ({ ...m, right: true })); break;
        case 'Space': setMovement(m => ({ ...m, jump: true })); break;
        case 'KeyF': setMovement(m => ({ ...m, action: true })); break; // Tecla F para entrar/sair
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': setMovement(m => ({ ...m, forward: false })); break;
        case 'KeyS': case 'ArrowDown': setMovement(m => ({ ...m, backward: false })); break;
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({ ...m, left: false })); break;
        case 'KeyD': case 'ArrowRight': setMovement(m => ({ ...m, right: false })); break;
        case 'Space': setMovement(m => ({ ...m, jump: false })); break;
        case 'KeyF': setMovement(m => ({ ...m, action: false })); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
}