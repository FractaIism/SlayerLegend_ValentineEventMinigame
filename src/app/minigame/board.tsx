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
    const teleportBlocks: { [key: number]: number } = { 7: 2, 14: 9 };
    const nextSlayerIndexes = moves.map((n) => (slayerIndex + n) % 16);
    const nextSlayerIndexes2 = nextSlayerIndexes.map((idx) =>
      idx in teleportBlocks ? teleportBlocks[idx] : idx,
    );
    return nextSlayerIndexes2.includes(blockIndex);
  }

  const colors = {
    CYAN: Symbol("cyan"),
    VIOLET: Symbol("violet"),
    MIXED: Symbol("mixed"),
    NONE: Symbol("none"),
  };

  const { validPositions } = useContext(GlobalVariableContext);

  const slayerIndex = positionToIndex(slayerPosition);

  return (
    <svg className={styles.overlay} width={boardSize} height={boardSize}>
      {[styles.cyanShadow, styles.violetShadow, styles.mixedShadow].map(
        (className) => (
          <SVGFilter key={className} className={className} />
        ),
      )}
      {range(5).map((row) =>
        range(5).map((col) => {
          if (blockExists(row, col)) {
            const blockIndex = positionToIndex({ row, col });
            const r145 = isBlockReachable(blockIndex, slayerIndex, [1, 4, 5]);
            const r236 = isBlockReachable(blockIndex, slayerIndex, [2, 3, 6]);
            const color =
              r145 && r236
                ? colors.MIXED
                : r145
                ? colors.CYAN
                : r236
                ? colors.VIOLET
                : colors.NONE;
            let blockClassName: string;
            let svgFilterId: string;
            switch (color) {
              case colors.CYAN:
                blockClassName = styles.cyan;
                svgFilterId = styles.cyanShadow;
                break;
              case colors.VIOLET:
                blockClassName = styles.violet;
                svgFilterId = styles.violetShadow;
                break;
              case colors.MIXED:
                blockClassName = styles.mixed;
                svgFilterId = styles.mixedShadow;
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
