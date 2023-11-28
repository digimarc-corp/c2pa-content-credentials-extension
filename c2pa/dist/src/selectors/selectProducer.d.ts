/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { Author } from '@contentauth/toolkit';
import { Manifest } from '../manifest';
/**
 * Gets the producer of this manifest, derived from its `stds.schema-org.CreativeWork` assertion, if available
 *
 * @param manifest - Manifest to derive data from
 */
export declare function selectProducer(manifest: Manifest): Author | null;
//# sourceMappingURL=selectProducer.d.ts.map