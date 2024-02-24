import styles from "./weights.module.scss";
import iconStyles from "./icons.module.scss";
import { useContext, useState } from "react";
import { orderBy } from "lodash";
import { GlobalVariableContext, ItemsContext } from "./context.tsx";
import { isDice } from "./utils.tsx";

export function Weights() {
  const [sorted, setSorted] = useState(true);

  return (
    <div className={styles.sortableWeightList}>
      <label className={styles.sortByWeightLabel}>
        <input
          type="checkbox"
          checked={sorted}
          onChange={() => setSorted(!sorted)}
        />
        Sort by weight
      </label>
      <WeightList sorted={sorted} />
    </div>
  );
}

function WeightList({ sorted }: { sorted: boolean }) {
  function updateItemWeight(className: string, newWeight: number) {
    updateItems((draftItems) => {
      const draftItem = draftItems.find((item) => item.className === className);
      if (!draftItem) {
        throw `className ${className} not found`;
      }
      draftItem.weight = newWeight;
    });
  }

  const { blockSize } = useContext(GlobalVariableContext);
  const [items, updateItems] = useContext(ItemsContext);

  let orderedItems = (
    sorted ? orderBy(items, ["weight"], ["desc"]) : items
  ).filter((item) => !isDice(item));

  return (
    <div
      className={styles.weightList}
      style={{
        gridTemplateRows: `repeat(${process.env.NEXT_PUBLIC_WEIGHT_LIST_ROWS}, ${blockSize}px)`,
      }}
    >
      {orderedItems.map(({ className, weight }) => (
        <WeightItem
          key={className}
          className={className}
          weight={weight}
          updateItemWeight={updateItemWeight}
        />
      ))}
    </div>
  );
}

function WeightItem({
  className,
  weight,
  updateItemWeight,
}: {
  className: string;
  weight: number;
  updateItemWeight: (className: string, newWeight: number) => void;
}) {
  return (
    <div className={styles.weightItem}>
      <div className={`${iconStyles.blockIcon} ${className}`} />
      <input
        className={styles.weightInput}
        type="text"
        value={weight}
        placeholder="0"
        onChange={(e) => {
          const floatValue = parseFloat(e.target.value);
          const repairedValue = Number.isNaN(floatValue) ? 0 : floatValue;
          updateItemWeight(className, repairedValue);
        }}
      />
    </div>
  );
}
