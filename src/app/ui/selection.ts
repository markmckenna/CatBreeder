/**
 * Unified selection system for interactable objects.
 * 
 * Any object that can be hovered/selected/acted upon uses this system.
 * This provides consistent hover effects, info display, and actions.
 */

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
export const isCatSelection = (s: Selectable | null): s is CatSelection => s?.type === 'cat';

/** Check if selection is furniture */
export const isFurnitureSelection = (s: Selectable | null): s is FurnitureSelection => s?.type === 'furniture';

/** Get a unique ID for a selectable for comparison */
export const getSelectableId = (s: Selectable): string =>
  s.type === 'cat' ? `cat-${s.cat.id}` : `furniture-${s.furnitureType}-${s.index}`;

/** Check if two selectables are the same */
export const isSameSelectable = (a: Selectable | null, b: Selectable | null): boolean =>
  a !== null && b !== null && getSelectableId(a) === getSelectableId(b);
