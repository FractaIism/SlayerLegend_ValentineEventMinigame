"use client";

import Image from "next/image";
import styles from "./board.module.scss";
import { useContext, ReactNode } from "react";
import { range } from "lodash";
import { GlobalVariableContext } from "./context.tsx";
import { Position } from "./slayer.tsx";
import { positionToIndex } from "./utils.tsx";

const boardSize = 250;

export function GameBoard({
  slayerPosition,
  setSlayerPosition,
  children,
}: {
  slayerPosition: Position;
  setSlayerPosition: (position: Position) => void;
  children: ReactNode;
}) {
  return (
    <>
      <Image
        src="/images/minigame.png"
        alt="minigame.png"
        width={boardSize}
        height={boardSize}
        unoptimized
      />
      <DecorativeSVGOverlay slayerPosition={slayerPosition} />
      <FunctionalSVGOverlay setSlayerPosition={setSlayerPosition} />
      {children}
    </>
  );
}

function FunctionalSVGOverlay({
  setSlayerPosition,
}: {
  setSlayerPosition: (position: Position) => void;
}) {
  function blockExists(row: number, col: number) {
    return validPositions.some(({ row: r, col: c }) => r === row && c === col);
  }

  const { validPositions } = useContext(GlobalVariableContext);

  return (
    <svg className={styles.overlay} width={boardSize} height={boardSize}>
      {range(5).map((row) =>
        range(5).map((col) =>
          blockExists(row, col) ? (
            <SVGRectBlock
              key={`${row}-${col}`}
              row={row}
              col={col}
              className={styles.overlayBlockInvisible}
              onClick={() => setSlayerPosition({ row: row, col: col })}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

function DecorativeSVGOverlay({
  slayerPosition,
}: {
  slayerPosition: Position;
}) {
  function blockExists(row: number, col: number) {
    return validPositions.some(({ row: r, col: c }) => r === row && c === col);
  }

  function isBlockReachable(
    blockIndex: number,
    slayerIndex: number,
    moves: number[],
  ) {
    const teleportBlocks: { [key: number]: number } = { 1: 7, 12: 4 };
    const nextSlayerIndexes = moves.map((n) => (slayerIndex + n) % 16);
    const nextSlayerIndexes2 = nextSlayerIndexes.map((idx) =>
      idx in teleportBlocks ? teleportBlocks[idx] : idx,
    );
    return nextSlayerIndexes2.includes(blockIndex);
  }

  const colors = {
    DICE1_COLOR: Symbol("dice1_color"),
    DICE2_COLOR: Symbol("dice2_color"),
    MIXED_COLOR: Symbol("mixed_color"),
    NONE: Symbol("none"),
  };

  const { validPositions } = useContext(GlobalVariableContext);

  const slayerIndex = positionToIndex(slayerPosition);

  return (
    <svg className={styles.overlay} width={boardSize} height={boardSize}>
      {[
        styles.dice1ColorShadow,
        styles.dice2ColorShadow,
        styles.mixedColorShadow,
      ].map((className) => (
        <SVGFilter key={className} className={className} />
      ))}
      {range(5).map((row) =>
        range(5).map((col) => {
          if (blockExists(row, col)) {
            const blockIndex = positionToIndex({ row, col });
            const r145 = isBlockReachable(blockIndex, slayerIndex, [1, 4, 6]);
            const r236 = isBlockReachable(blockIndex, slayerIndex, [2, 3, 5]);
            const color =
              r145 && r236
                ? colors.MIXED_COLOR
                : r145
                ? colors.DICE1_COLOR
                : r236
                ? colors.DICE2_COLOR
                : colors.NONE;
            let blockClassName: string;
            let svgFilterId: string;
            switch (color) {
              case colors.DICE1_COLOR:
                blockClassName = styles.dice1Color;
                svgFilterId = styles.dice1ColorShadow;
                break;
              case colors.DICE2_COLOR:
                blockClassName = styles.dice2Color;
                svgFilterId = styles.dice2ColorShadow;
                break;
              case colors.MIXED_COLOR:
                blockClassName = styles.mixedColor;
                svgFilterId = styles.mixedColorShadow;
                break;
              default:
                blockClassName = "";
                svgFilterId = "";
                break;
            }

            return (
              <SVGRectBlock
                key={`${row}-${col}`}
                row={row}
                col={col}
                className={`${styles.overlayBlockVisible} ${blockClassName}`}
                svgFilterId={svgFilterId}
              />
            );
          }
        }),
      )}
    </svg>
  );
}

function SVGFilter({ className }: { className: string }) {
  return (
    <filter id={className}>
      <feDropShadow className={className} dx="0" dy="0" stdDeviation="2" />
    </filter>
  );
}

function SVGRectBlock({
  row,
  col,
  className,
  svgFilterId: filterId = "",
  onClick = undefined,
}: {
  row: number;
  col: number;
  className: string;
  svgFilterId?: string;
  onClick?: () => void;
}) {
  const ctx = useContext(GlobalVariableContext);
  return (
    <rect
      className={className}
      x={ctx.startX + col * (ctx.blockSize + ctx.gapX)}
      y={ctx.startY + row * (ctx.blockSize + ctx.gapY)}
      rx="3px"
      ry="3px"
      width={ctx.blockSize}
      height={ctx.blockSize}
      onClick={onClick ?? (() => null)}
      style={{
        filter: `url(#${filterId})`,
      }}
    />
  );
}
