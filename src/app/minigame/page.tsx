"use client";

import styles from "./page.module.scss";
import { useState, StrictMode } from "react";
import { Slayer, Position } from "./slayer.tsx";
import { GameBoard } from "./board.tsx";
import { Providers } from "./context.tsx";
import { Weights } from "./weights.tsx";
import { DiceCalculator } from "./dice.tsx";

export default function Home() {
  const [slayerPosition, setSlayerPosition]: [Position, any] = useState({
    row: 4,
    col: 4,
  });

  return (
    <StrictMode>
      <main className={styles.main}>
        <Providers>
          <GameBoard
            slayerPosition={slayerPosition}
            setSlayerPosition={setSlayerPosition}
          >
            <Slayer position={slayerPosition} />
          </GameBoard>
          <Weights />
          <DiceCalculator slayerPosition={slayerPosition} />
        </Providers>
      </main>
    </StrictMode>
  );
}
