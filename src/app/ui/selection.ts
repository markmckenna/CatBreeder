/** Unified selection system for interactable objects (hover, select, act) */

import type { Cat } from '../cats/genetics.ts';
import type { FurnitureItemType, FurnitureItem } from '../environment/furniture.ts';

/** Types of selectable objects */
export type SelectableType = 'cat' | 'furniture';

/** Selection for a cat */
export interface CatSelection {
  type: 'cat';
  cat: Cat;
}

/** Selection for furniture */
export interface FurnitureSelection {
  type: 'furniture';
  furnitureType: FurnitureItemType;
  item: FurnitureItem;
  index: number;
}

/** Union of all selectable objects */
export type Selectable = CatSelection | FurnitureSelection;

/** Check if selection is a cat */
export const isCatSelection = (it: Selectable | null): it is CatSelection => it?.type === 'cat';

/** Check if selection is furniture */
export const isFurnitureSelection = (it: Selectable | null): it is FurnitureSelection => it?.type === 'furniture';

/** Get a unique ID for a selectable for comparison */
export const getSelectableId = (it: Selectable) =>
  it.type === 'cat' ? `cat-${it.cat.id}` : `furniture-${it.furnitureType}-${it.index}`;

/** Check if two selectables are the same */
export const isSameSelectable = (a: Selectable | null, b: Selectable | null) =>
  a !== null && b !== null && getSelectableId(a) === getSelectableId(b);
