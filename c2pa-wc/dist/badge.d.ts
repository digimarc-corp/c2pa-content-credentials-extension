/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { L2Ingredient, L2ManifestStore } from 'c2pa';
import { Badge } from './components/Thumbnail';
export declare function getBadgeFromManifestStore(manifestStore?: L2ManifestStore | null): Badge;
export declare function getBadgeFromIngredient(ingredient: L2Ingredient): Badge;
