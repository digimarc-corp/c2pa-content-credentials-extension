
/*!*************************************************************************
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. 
 **************************************************************************/

(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    /**
     * Copyright 2023 Adobe
     * All Rights Reserved.
     *
     * NOTICE: Adobe permits you to use, modify, and distribute this file in
     * accordance with the terms of the Adobe license agreement accompanying
     * it.
     */
    // From https://github.com/josdejong/workerpool/blob/master/src/worker.js#L76-L83
    function serializeError(error) {
        return Object.getOwnPropertyNames(error).reduce(function (product, name) {
            return Object.defineProperty(product, name, {
                value: error[name],
                enumerable: true,
            });
        }, {});
    }

    /**
     * Copyright 2023 Adobe
     * All Rights Reserved.
     *
     * NOTICE: Adobe permits you to use, modify, and distribute this file in
     * accordance with the terms of the Adobe license agreement accompanying
     * it.
     */
    function setupWorker(methods) {
        onmessage = async (e) => {
            const { args, method } = e.data;
            try {
                const res = await methods[method](...args);
                postMessage({
                    type: 'success',
                    data: res,
                });
            }
            catch (error) {
                postMessage({
                    type: 'error',
                    error: serializeError(error),
                });
            }
        };
    }

    let wasm$1;

    const cachedTextDecoder$1 = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder$1.decode();

    let cachedUint8Memory0$1 = new Uint8Array();

    function getUint8Memory0$1() {
        if (cachedUint8Memory0$1.byteLength === 0) {
            cachedUint8Memory0$1 = new Uint8Array(wasm$1.memory.buffer);
        }
        return cachedUint8Memory0$1;
    }

    function getStringFromWasm0$1(ptr, len) {
        return cachedTextDecoder$1.decode(getUint8Memory0$1().subarray(ptr, ptr + len));
    }

    let WASM_VECTOR_LEN$1 = 0;

    const cachedTextEncoder$1 = new TextEncoder('utf-8');

    const encodeString$1 = (typeof cachedTextEncoder$1.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder$1.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder$1.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0$1(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder$1.encode(arg);
            const ptr = malloc(buf.length);
            getUint8Memory0$1().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN$1 = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len);

        const mem = getUint8Memory0$1();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3);
            const view = getUint8Memory0$1().subarray(ptr + offset, ptr + len);
            const ret = encodeString$1(arg, view);

            offset += ret.written;
        }

        WASM_VECTOR_LEN$1 = offset;
        return ptr;
    }

    function isLikeNone$1(x) {
        return x === undefined || x === null;
    }

    let cachedInt32Memory0$1 = new Int32Array();

    function getInt32Memory0$1() {
        if (cachedInt32Memory0$1.byteLength === 0) {
            cachedInt32Memory0$1 = new Int32Array(wasm$1.memory.buffer);
        }
        return cachedInt32Memory0$1;
    }

    let cachedFloat64Memory0$1 = new Float64Array();

    function getFloat64Memory0$1() {
        if (cachedFloat64Memory0$1.byteLength === 0) {
            cachedFloat64Memory0$1 = new Float64Array(wasm$1.memory.buffer);
        }
        return cachedFloat64Memory0$1;
    }

    function debugString$1(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString$1(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString$1(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }

    function takeFromExternrefTable0(idx) {
        const value = wasm$1.__wbindgen_export_2.get(idx);
        wasm$1.__externref_table_dealloc(idx);
        return value;
    }
    /**
    * @param {any} buf
    * @returns {number}
    */
    function scan_array_buffer(buf) {
        try {
            const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
            wasm$1.scan_array_buffer(retptr, buf);
            var r0 = getInt32Memory0$1()[retptr / 4 + 0];
            var r1 = getInt32Memory0$1()[retptr / 4 + 1];
            var r2 = getInt32Memory0$1()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm$1.__wbindgen_add_to_stack_pointer(16);
        }
    }

    async function load$1(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    function getImports$1() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_isArray_27c46c67f498e15d = function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        };
        imports.wbg.__wbg_length_6e3bbe7c8bd4dbd8 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbg_get_57245cc7d7c7619d = function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        };
        imports.wbg.__wbg_isSafeInteger_dfa0593e8d7ac35a = function(arg0) {
            const ret = Number.isSafeInteger(arg0);
            return ret;
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0$1(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
            const ret = new Error();
            return ret;
        };
        imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr0 = passStringToWasm0$1(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN$1;
            getInt32Memory0$1()[arg0 / 4 + 1] = len0;
            getInt32Memory0$1()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
            try {
                console.error(getStringFromWasm0$1(arg0, arg1));
            } finally {
                wasm$1.__wbindgen_free(arg0, arg1);
            }
        };
        imports.wbg.__wbg_length_9e1ae1900cb0fbd5 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm$1.memory;
            return ret;
        };
        imports.wbg.__wbg_buffer_3f3d764d4747d564 = function(arg0) {
            const ret = arg0.buffer;
            return ret;
        };
        imports.wbg.__wbg_new_8c3f0052272a457a = function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        };
        imports.wbg.__wbg_set_83db9690f9353e79 = function(arg0, arg1, arg2) {
            arg0.set(arg1, arg2 >>> 0);
        };
        imports.wbg.__wbg_instanceof_Uint8Array_971eeda69eb75003 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof Uint8Array;
            } catch {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_ArrayBuffer_e5e48f4762c5610b = function(arg0) {
            let result;
            try {
                result = arg0 instanceof ArrayBuffer;
            } catch {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
            const ret = arg0 == arg1;
            return ret;
        };
        imports.wbg.__wbindgen_boolean_get = function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
            return ret;
        };
        imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr0 = isLikeNone$1(ret) ? 0 : passStringToWasm0$1(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN$1;
            getInt32Memory0$1()[arg0 / 4 + 1] = len0;
            getInt32Memory0$1()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getFloat64Memory0$1()[arg0 / 8 + 1] = isLikeNone$1(ret) ? 0 : ret;
            getInt32Memory0$1()[arg0 / 4 + 0] = !isLikeNone$1(ret);
        };
        imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0$1(arg0, arg1));
            return ret;
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString$1(arg1);
            const ptr0 = passStringToWasm0$1(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN$1;
            getInt32Memory0$1()[arg0 / 4 + 1] = len0;
            getInt32Memory0$1()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0$1(arg0, arg1));
        };
        imports.wbg.__wbindgen_init_externref_table = function() {
            const table = wasm$1.__wbindgen_export_2;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        };

        return imports;
    }

    function finalizeInit$1(instance, module) {
        wasm$1 = instance.exports;
        init$1.__wbindgen_wasm_module = module;
        cachedFloat64Memory0$1 = new Float64Array();
        cachedInt32Memory0$1 = new Int32Array();
        cachedUint8Memory0$1 = new Uint8Array();

        wasm$1.__wbindgen_start();
        return wasm$1;
    }

    async function init$1(input) {
        if (typeof input === 'undefined') {
            input = new URL('detector_bg.wasm', (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('c2pa.worker.js', document.baseURI).href)));
        }
        const imports = getImports$1();

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        const { instance, module } = await load$1(await input, imports);

        return finalizeInit$1(instance, module);
    }

    let wasm;

    const heap = new Array(32).fill(undefined);

    heap.push(undefined, null, true, false);

    function getObject(idx) { return heap[idx]; }

    let heap_next = heap.length;

    function dropObject(idx) {
        if (idx < 36) return;
        heap[idx] = heap_next;
        heap_next = idx;
    }

    function takeObject(idx) {
        const ret = getObject(idx);
        dropObject(idx);
        return ret;
    }

    function addHeapObject(obj) {
        if (heap_next === heap.length) heap.push(heap.length + 1);
        const idx = heap_next;
        heap_next = heap[idx];

        heap[idx] = obj;
        return idx;
    }

    const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder.decode();

    let cachedUint8Memory0 = new Uint8Array();

    function getUint8Memory0() {
        if (cachedUint8Memory0.byteLength === 0) {
            cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8Memory0;
    }

    function getStringFromWasm0(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
    }

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    let cachedFloat64Memory0 = new Float64Array();

    function getFloat64Memory0() {
        if (cachedFloat64Memory0.byteLength === 0) {
            cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
        }
        return cachedFloat64Memory0;
    }

    let cachedInt32Memory0 = new Int32Array();

    function getInt32Memory0() {
        if (cachedInt32Memory0.byteLength === 0) {
            cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
        }
        return cachedInt32Memory0;
    }

    let WASM_VECTOR_LEN = 0;

    const cachedTextEncoder = new TextEncoder('utf-8');

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length);
            getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len);

        const mem = getUint8Memory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3);
            const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    function debugString(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }

    const CLOSURE_DTORS = new FinalizationRegistry(state => {
        wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
    });

    function makeMutClosure(arg0, arg1, dtor, f) {
        const state = { a: arg0, b: arg1, cnt: 1, dtor };
        const real = (...args) => {
            // First up with a closure we increment the internal reference
            // count. This ensures that the Rust closure environment won't
            // be deallocated while we're invoking it.
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return f(a, state.b, ...args);
            } finally {
                if (--state.cnt === 0) {
                    wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
                    CLOSURE_DTORS.unregister(state);
                } else {
                    state.a = a;
                }
            }
        };
        real.original = state;
        CLOSURE_DTORS.register(real, state, state);
        return real;
    }
    function __wbg_adapter_38(arg0, arg1, arg2) {
        wasm.wasm_bindgen__convert__closures__invoke1_mut__hfae04bd6bac436bc(arg0, arg1, addHeapObject(arg2));
    }

    /**
    * @param {any} buf
    * @param {string} mime_type
    * @returns {Promise<any>}
    */
    function getManifestStoreFromArrayBuffer(buf, mime_type) {
        const ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.getManifestStoreFromArrayBuffer(addHeapObject(buf), ptr0, len0);
        return takeObject(ret);
    }

    /**
    * @param {any} manifest_buffer
    * @param {any} asset_buffer
    * @param {string} mime_type
    * @returns {Promise<any>}
    */
    function getManifestStoreFromManifestAndAsset(manifest_buffer, asset_buffer, mime_type) {
        const ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.getManifestStoreFromManifestAndAsset(addHeapObject(manifest_buffer), addHeapObject(asset_buffer), ptr0, len0);
        return takeObject(ret);
    }

    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    }

    function getArrayU8FromWasm0(ptr, len) {
        return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
    }
    function __wbg_adapter_106(arg0, arg1, arg2, arg3) {
        wasm.wasm_bindgen__convert__closures__invoke2_mut__heec1dd10d637cbf2(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
    }

    async function load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    function getImports() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
            takeObject(arg0);
        };
        imports.wbg.__wbg_call_168da88779e35f61 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_Window_3144a6cebf9a877c = function(arg0) {
            const ret = getObject(arg0).Window;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_undefined = function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        };
        imports.wbg.__wbg_WorkerGlobalScope_1744d6a782d3cca8 = function(arg0) {
            const ret = getObject(arg0).WorkerGlobalScope;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_crypto_9f07beb1e97bfa1b = function() { return handleError(function (arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_crypto_667306dda14c4f0d = function() { return handleError(function (arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_subtle_655bd6c3f4d598bb = function(arg0) {
            const ret = getObject(arg0).subtle;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_new_1d9a920c6bfc44a8 = function() {
            const ret = new Array();
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_push_740e4b286702d964 = function(arg0, arg1) {
            const ret = getObject(arg0).push(getObject(arg1));
            return ret;
        };
        imports.wbg.__wbg_debug_aa79221726d7e043 = function(arg0, arg1) {
            console.debug(getObject(arg0), getObject(arg1));
        };
        imports.wbg.__wbg_new_0b9bfdd97583284e = function() {
            const ret = new Object();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_verify_5b1aa2f26307e87b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = getObject(arg0).verify(getObject(arg1), getObject(arg2), getObject(arg3), getObject(arg4));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_is_falsy = function(arg0) {
            const ret = !getObject(arg0);
            return ret;
        };
        imports.wbg.__wbg_newwithlength_f5933855e4f48a19 = function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_length_9e1ae1900cb0fbd5 = function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        };
        imports.wbg.__wbg_set_83db9690f9353e79 = function(arg0, arg1, arg2) {
            getObject(arg0).set(getObject(arg1), arg2 >>> 0);
        };
        imports.wbg.__wbg_buffer_21310ea17257b0b4 = function(arg0) {
            const ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_number_new = function(arg0) {
            const ret = arg0;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_set_a68214f35c417fa9 = function(arg0, arg1, arg2) {
            getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
        };
        imports.wbg.__wbg_new_268f7b7dd3430798 = function() {
            const ret = new Map();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_set_bd72c078edfa51ad = function(arg0, arg1, arg2) {
            getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
        };
        imports.wbg.__wbg_set_933729cf5b66ac11 = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_string = function(arg0) {
            const ret = typeof(getObject(arg0)) === 'string';
            return ret;
        };
        imports.wbg.__wbg_now_58886682b7e790d7 = function() {
            const ret = Date.now();
            return ret;
        };
        imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
            const ret = BigInt.asUintN(64, arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_new_8c3f0052272a457a = function(arg0) {
            const ret = new Uint8Array(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_from_7ce3cb27cb258569 = function(arg0) {
            const ret = Array.from(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_String_4370c5505c674d30 = function(arg0, arg1) {
            const ret = String(getObject(arg1));
            const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbg_new_8d2af00bc1e329ee = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_setname_d26cefd43ea3a082 = function(arg0, arg1, arg2) {
            getObject(arg0).name = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_new_9962f939219f1820 = function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return __wbg_adapter_106(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return addHeapObject(ret);
            } finally {
                state0.a = state0.b = 0;
            }
        };
        imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_isArray_27c46c67f498e15d = function(arg0) {
            const ret = Array.isArray(getObject(arg0));
            return ret;
        };
        imports.wbg.__wbg_length_6e3bbe7c8bd4dbd8 = function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        };
        imports.wbg.__wbg_get_57245cc7d7c7619d = function(arg0, arg1) {
            const ret = getObject(arg0)[arg1 >>> 0];
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
            getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
        };
        imports.wbg.__wbg_isSafeInteger_dfa0593e8d7ac35a = function(arg0) {
            const ret = Number.isSafeInteger(getObject(arg0));
            return ret;
        };
        imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
            const ret = new Error();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
            const ret = getObject(arg1).stack;
            const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
            try {
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(arg0, arg1);
            }
        };
        imports.wbg.__wbg_process_0cc2ada8524d6f83 = function(arg0) {
            const ret = getObject(arg0).process;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_object = function(arg0) {
            const val = getObject(arg0);
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        };
        imports.wbg.__wbg_versions_c11acceab27a6c87 = function(arg0) {
            const ret = getObject(arg0).versions;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_node_7ff1ce49caf23815 = function(arg0) {
            const ret = getObject(arg0).node;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_static_accessor_NODE_MODULE_cf6401cc1091279e = function() {
            const ret = module;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_require_a746e79b322b9336 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_crypto_2036bed7c44c25e7 = function(arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_msCrypto_a21fc88caf1ecdc8 = function(arg0) {
            const ret = getObject(arg0).msCrypto;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_randomFillSync_065afffde01daa66 = function() { return handleError(function (arg0, arg1, arg2) {
            getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
        }, arguments) };
        imports.wbg.__wbg_subarray_58ad4efbb5bcb886 = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_getRandomValues_b99eec4244a475bb = function() { return handleError(function (arg0, arg1) {
            getObject(arg0).getRandomValues(getObject(arg1));
        }, arguments) };
        imports.wbg.__wbg_self_6d479506f72c6a71 = function() { return handleError(function () {
            const ret = self.self;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_window_f2557cc78490aceb = function() { return handleError(function () {
            const ret = window.window;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_globalThis_7f206bda628d5286 = function() { return handleError(function () {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_global_ba75c50d1cf384f4 = function() { return handleError(function () {
            const ret = global.global;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_newnoargs_b5b063fc6c2f0376 = function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_call_97ae9d8645dc388b = function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_buffer_3f3d764d4747d564 = function(arg0) {
            const ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_newwithbyteoffsetandlength_d9aa266703cb98be = function(arg0, arg1, arg2) {
            const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_set_bf3f89b92d5a34bf = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_instanceof_Uint8Array_971eeda69eb75003 = function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof Uint8Array;
            } catch {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_ArrayBuffer_e5e48f4762c5610b = function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof ArrayBuffer;
            } catch {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
            const ret = getObject(arg0) == getObject(arg1);
            return ret;
        };
        imports.wbg.__wbindgen_boolean_get = function(arg0) {
            const v = getObject(arg0);
            const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
            return ret;
        };
        imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString(getObject(arg1));
            const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_then_cedad20fbbd9418a = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_resolve_99fe17964f31ffc0 = function(arg0) {
            const ret = Promise.resolve(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_then_11f7a54d67b4bfad = function(arg0, arg1) {
            const ret = getObject(arg0).then(getObject(arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_cb_drop = function(arg0) {
            const obj = takeObject(arg0).original;
            if (obj.cnt-- == 1) {
                obj.a = 0;
                return true;
            }
            const ret = false;
            return ret;
        };
        imports.wbg.__wbg_debug_64711eb2fc6980ef = function(arg0, arg1, arg2, arg3) {
            console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_error_00c5d571f754f629 = function(arg0, arg1, arg2, arg3) {
            console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_info_d60a960a4e955dc2 = function(arg0, arg1, arg2, arg3) {
            console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_log_de258f66ad9eb784 = function(arg0, arg1, arg2, arg3) {
            console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_warn_be542501a57387a5 = function(arg0, arg1, arg2, arg3) {
            console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_importKey_c7da74a5821fc721 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const ret = getObject(arg0).importKey(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4), arg5 !== 0, getObject(arg6));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_closure_wrapper4205 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 116, __wbg_adapter_38);
            return addHeapObject(ret);
        };

        return imports;
    }

    function finalizeInit(instance, module) {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;
        cachedFloat64Memory0 = new Float64Array();
        cachedInt32Memory0 = new Int32Array();
        cachedUint8Memory0 = new Uint8Array();

        wasm.__wbindgen_start();
        return wasm;
    }

    async function init(input) {
        if (typeof input === 'undefined') {
            input = new URL('toolkit_bg.wasm', (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('c2pa.worker.js', document.baseURI).href)));
        }
        const imports = getImports();

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        const { instance, module } = await load(await input, imports);

        return finalizeInit(instance, module);
    }

    /**
     * Copyright 2021 Adobe
     * All Rights Reserved.
     *
     * NOTICE: Adobe permits you to use, modify, and distribute this file in
     * accordance with the terms of the Adobe license agreement accompanying
     * it.
     */
    const worker = {
        async compileWasm(buffer) {
            return WebAssembly.compile(buffer);
        },
        async getReport(wasm, buffer, type) {
            await init(wasm);
            return getManifestStoreFromArrayBuffer(buffer, type);
        },
        async getReportFromAssetAndManifestBuffer(wasm, manifestBuffer, asset) {
            await init(wasm);
            const assetBuffer = await asset.arrayBuffer();
            return getManifestStoreFromManifestAndAsset(manifestBuffer, assetBuffer, asset.type);
        },
        async scanInput(wasm, buffer) {
            await init$1(wasm);
            try {
                const offset = await scan_array_buffer(buffer);
                return { found: true, offset };
            }
            catch (err) {
                return { found: false };
            }
        },
    };
    setupWorker(worker);

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYzJwYS53b3JrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcG9vbC9lcnJvci50cyIsIi4uLy4uL3NyYy9saWIvcG9vbC93b3JrZXIudHMiLCIuLi8uLi9kZXRlY3Rvci9wa2cvZGV0ZWN0b3IuanMiLCIuLi8uLi90b29sa2l0L3BrZy90b29sa2l0LmpzIiwiLi4vLi4vd29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMjMgQWRvYmVcbiAqIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTk9USUNFOiBBZG9iZSBwZXJtaXRzIHlvdSB0byB1c2UsIG1vZGlmeSwgYW5kIGRpc3RyaWJ1dGUgdGhpcyBmaWxlIGluXG4gKiBhY2NvcmRhbmNlIHdpdGggdGhlIHRlcm1zIG9mIHRoZSBBZG9iZSBsaWNlbnNlIGFncmVlbWVudCBhY2NvbXBhbnlpbmdcbiAqIGl0LlxuICovXG5cbmludGVyZmFjZSBTZXJpYWxpemVkRXJyb3Ige1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbi8vIEZyb20gaHR0cHM6Ly9naXRodWIuY29tL2pvc2Rlam9uZy93b3JrZXJwb29sL2Jsb2IvbWFzdGVyL3NyYy93b3JrZXIuanMjTDc2LUw4M1xuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUVycm9yKGVycm9yOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogU2VyaWFsaXplZEVycm9yIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGVycm9yKS5yZWR1Y2UoZnVuY3Rpb24gKHByb2R1Y3QsIG5hbWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2R1Y3QsIG5hbWUsIHtcbiAgICAgIHZhbHVlOiBlcnJvcltuYW1lXSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgfSk7XG4gIH0sIHt9KTtcbn1cblxuLy8gRnJvbSBodHRwczovL2dpdGh1Yi5jb20vam9zZGVqb25nL3dvcmtlcnBvb2wvYmxvYi9tYXN0ZXIvc3JjL1dvcmtlckhhbmRsZXIuanMjTDE3OS1MMTkzXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemVFcnJvcihzZXJpYWxpemVkRXJyb3I6IFNlcmlhbGl6ZWRFcnJvcik6IEVycm9yIHtcbiAgdmFyIHRlbXAgPSBuZXcgRXJyb3IoJycpO1xuICB2YXIgcHJvcHMgPSBPYmplY3Qua2V5cyhzZXJpYWxpemVkRXJyb3IpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGVtcFtwcm9wc1tpXV0gPSBzZXJpYWxpemVkRXJyb3JbcHJvcHNbaV1dO1xuICB9XG5cbiAgcmV0dXJuIHRlbXA7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDIzIEFkb2JlXG4gKiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIE5PVElDRTogQWRvYmUgcGVybWl0cyB5b3UgdG8gdXNlLCBtb2RpZnksIGFuZCBkaXN0cmlidXRlIHRoaXMgZmlsZSBpblxuICogYWNjb3JkYW5jZSB3aXRoIHRoZSB0ZXJtcyBvZiB0aGUgQWRvYmUgbGljZW5zZSBhZ3JlZW1lbnQgYWNjb21wYW55aW5nXG4gKiBpdC5cbiAqL1xuXG5pbXBvcnQgeyBzZXJpYWxpemVFcnJvciB9IGZyb20gJy4vZXJyb3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlcXVlc3Qge1xuICBtZXRob2Q6IHN0cmluZztcbiAgYXJnczogdW5rbm93bltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlc3BvbnNlU3VjY2VzcyB7XG4gIHR5cGU6ICdzdWNjZXNzJztcbiAgZGF0YTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlc3BvbnNlRXJyb3Ige1xuICB0eXBlOiAnZXJyb3InO1xuICBlcnJvcjogYW55O1xufVxuXG5leHBvcnQgdHlwZSBXb3JrZXJSZXNwb25zZSA9IFdvcmtlclJlc3BvbnNlU3VjY2VzcyB8IFdvcmtlclJlc3BvbnNlRXJyb3I7XG5cbnR5cGUgV29ya2VyTWV0aG9kcyA9IFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnlbXSkgPT4gYW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwV29ya2VyKG1ldGhvZHM6IFdvcmtlck1ldGhvZHMpIHtcbiAgb25tZXNzYWdlID0gYXN5bmMgKGU6IE1lc3NhZ2VFdmVudDxXb3JrZXJSZXF1ZXN0PikgPT4ge1xuICAgIGNvbnN0IHsgYXJncywgbWV0aG9kIH0gPSBlLmRhdGE7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG1ldGhvZHNbbWV0aG9kXSguLi5hcmdzKTtcblxuICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHJlcyxcbiAgICAgIH0gYXMgV29ya2VyUmVzcG9uc2UpO1xuICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIGVycm9yOiBzZXJpYWxpemVFcnJvcihlcnJvciBhcyBFcnJvciksXG4gICAgICB9IGFzIFdvcmtlclJlc3BvbnNlKTtcbiAgICB9XG4gIH07XG59XG4iLCJcbmxldCB3YXNtO1xuXG5jb25zdCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7XG5cbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuXG5sZXQgY2FjaGVkVWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWRVaW50OE1lbW9yeTAuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjYWNoZWRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkVWludDhNZW1vcnkwO1xufVxuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgbGVuKSk7XG59XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5jb25zdCBjYWNoZWRUZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuXG5mdW5jdGlvbiBpc0xpa2VOb25lKHgpIHtcbiAgICByZXR1cm4geCA9PT0gdW5kZWZpbmVkIHx8IHggPT09IG51bGw7XG59XG5cbmxldCBjYWNoZWRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSgpO1xuXG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZEludDMyTWVtb3J5MC5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhY2hlZEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRJbnQzMk1lbW9yeTA7XG59XG5cbmxldCBjYWNoZWRGbG9hdDY0TWVtb3J5MCA9IG5ldyBGbG9hdDY0QXJyYXkoKTtcblxuZnVuY3Rpb24gZ2V0RmxvYXQ2NE1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZEZsb2F0NjRNZW1vcnkwLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgICAgY2FjaGVkRmxvYXQ2NE1lbW9yeTAgPSBuZXcgRmxvYXQ2NEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRGbG9hdDY0TWVtb3J5MDtcbn1cblxuZnVuY3Rpb24gZGVidWdTdHJpbmcodmFsKSB7XG4gICAgLy8gcHJpbWl0aXZlIHR5cGVzXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICBgJHt2YWx9YDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGBcIiR7dmFsfVwiYDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB2YWwuZGVzY3JpcHRpb247XG4gICAgICAgIGlmIChkZXNjcmlwdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYFN5bWJvbCgke2Rlc2NyaXB0aW9ufSlgO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHZhbC5uYW1lO1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgJiYgbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYEZ1bmN0aW9uKCR7bmFtZX0pYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnRnVuY3Rpb24nO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG9iamVjdHNcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHZhbC5sZW5ndGg7XG4gICAgICAgIGxldCBkZWJ1ZyA9ICdbJztcbiAgICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlYnVnICs9IGRlYnVnU3RyaW5nKHZhbFswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWJ1ZyArPSAnLCAnICsgZGVidWdTdHJpbmcodmFsW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyArPSAnXSc7XG4gICAgICAgIHJldHVybiBkZWJ1ZztcbiAgICB9XG4gICAgLy8gVGVzdCBmb3IgYnVpbHQtaW5cbiAgICBjb25zdCBidWlsdEluTWF0Y2hlcyA9IC9cXFtvYmplY3QgKFteXFxdXSspXFxdLy5leGVjKHRvU3RyaW5nLmNhbGwodmFsKSk7XG4gICAgbGV0IGNsYXNzTmFtZTtcbiAgICBpZiAoYnVpbHRJbk1hdGNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjbGFzc05hbWUgPSBidWlsdEluTWF0Y2hlc1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGYWlsZWQgdG8gbWF0Y2ggdGhlIHN0YW5kYXJkICdbb2JqZWN0IENsYXNzTmFtZV0nXG4gICAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCk7XG4gICAgfVxuICAgIGlmIChjbGFzc05hbWUgPT0gJ09iamVjdCcpIHtcbiAgICAgICAgLy8gd2UncmUgYSB1c2VyIGRlZmluZWQgY2xhc3Mgb3IgT2JqZWN0XG4gICAgICAgIC8vIEpTT04uc3RyaW5naWZ5IGF2b2lkcyBwcm9ibGVtcyB3aXRoIGN5Y2xlcywgYW5kIGlzIGdlbmVyYWxseSBtdWNoXG4gICAgICAgIC8vIGVhc2llciB0aGFuIGxvb3BpbmcgdGhyb3VnaCBvd25Qcm9wZXJ0aWVzIG9mIGB2YWxgLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuICdPYmplY3QoJyArIEpTT04uc3RyaW5naWZ5KHZhbCkgKyAnKSc7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBlcnJvcnNcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGAke3ZhbC5uYW1lfTogJHt2YWwubWVzc2FnZX1cXG4ke3ZhbC5zdGFja31gO1xuICAgIH1cbiAgICAvLyBUT0RPIHdlIGNvdWxkIHRlc3QgZm9yIG1vcmUgdGhpbmdzIGhlcmUsIGxpa2UgYFNldGBzIGFuZCBgTWFwYHMuXG4gICAgcmV0dXJuIGNsYXNzTmFtZTtcbn1cbi8qKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWluKCkge1xuICAgIHdhc20ubWFpbigpO1xufVxuXG5mdW5jdGlvbiB0YWtlRnJvbUV4dGVybnJlZlRhYmxlMChpZHgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHdhc20uX193YmluZGdlbl9leHBvcnRfMi5nZXQoaWR4KTtcbiAgICB3YXNtLl9fZXh0ZXJucmVmX3RhYmxlX2RlYWxsb2MoaWR4KTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG4vKipcbiogQHBhcmFtIHthbnl9IGJ1ZlxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FuX2FycmF5X2J1ZmZlcihidWYpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgd2FzbS5zY2FuX2FycmF5X2J1ZmZlcihyZXRwdHIsIGJ1Zik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICB2YXIgcjIgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMl07XG4gICAgICAgIGlmIChyMikge1xuICAgICAgICAgICAgdGhyb3cgdGFrZUZyb21FeHRlcm5yZWZUYWJsZTAocjEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByMCA+Pj4gMDtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZChtb2R1bGUsIGltcG9ydHMpIHtcbiAgICBpZiAodHlwZW9mIFJlc3BvbnNlID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZSBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSAhPSAnYXBwbGljYXRpb24vd2FzbScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nYCBmYWlsZWQgYmVjYXVzZSB5b3VyIHNlcnZlciBkb2VzIG5vdCBzZXJ2ZSB3YXNtIHdpdGggYGFwcGxpY2F0aW9uL3dhc21gIE1JTUUgdHlwZS4gRmFsbGluZyBiYWNrIHRvIGBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZWAgd2hpY2ggaXMgc2xvd2VyLiBPcmlnaW5hbCBlcnJvcjpcXG5cIiwgZSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgbW9kdWxlLmFycmF5QnVmZmVyKCk7XG4gICAgICAgIHJldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShieXRlcywgaW1wb3J0cyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGluc3RhbmNlLCBtb2R1bGUgfTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRJbXBvcnRzKCkge1xuICAgIGNvbnN0IGltcG9ydHMgPSB7fTtcbiAgICBpbXBvcnRzLndiZyA9IHt9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2lzQXJyYXlfMjdjNDZjNjdmNDk4ZTE1ZCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gQXJyYXkuaXNBcnJheShhcmcwKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2xlbmd0aF82ZTNiYmU3YzhiZDRkYmQ4ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2dldF81NzI0NWNjN2Q3Yzc2MTlkID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwW2FyZzEgPj4+IDBdO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaXNTYWZlSW50ZWdlcl9kZmEwNTkzZThkN2FjMzVhID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBOdW1iZXIuaXNTYWZlSW50ZWdlcihhcmcwKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fc3RyaW5nX25ldyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3X2FiZGE3NmU4ODNiYThhNWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdGFja182NTgyNzlmZTQ0NTQxY2Y2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcxLnN0YWNrO1xuICAgICAgICBjb25zdCBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIGNvbnN0IGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMV0gPSBsZW4wO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDBdID0gcHRyMDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2Vycm9yX2Y4NTE2NjdhZjcxYmNmYzYgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShhcmcwLCBhcmcxKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbGVuZ3RoXzllMWFlMTkwMGNiMGZiZDUgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGFyZzAubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9tZW1vcnkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5tZW1vcnk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19idWZmZXJfM2YzZDc2NGQ0NzQ3ZDU2NCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gYXJnMC5idWZmZXI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfOGMzZjAwNTIyNzJhNDU3YSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVpbnQ4QXJyYXkoYXJnMCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfODNkYjk2OTBmOTM1M2U3OSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgYXJnMC5zZXQoYXJnMSwgYXJnMiA+Pj4gMCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pbnN0YW5jZW9mX1VpbnQ4QXJyYXlfOTcxZWVkYTY5ZWI3NTAwMyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZzAgaW5zdGFuY2VvZiBVaW50OEFycmF5O1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJldCA9IHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2luc3RhbmNlb2ZfQXJyYXlCdWZmZXJfZTVlNDhmNDc2MmM1NjEwYiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZzAgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcjtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXQgPSByZXN1bHQ7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2pzdmFsX2xvb3NlX2VxID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwID09IGFyZzE7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Jvb2xlYW5fZ2V0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCB2ID0gYXJnMDtcbiAgICAgICAgY29uc3QgcmV0ID0gdHlwZW9mKHYpID09PSAnYm9vbGVhbicgPyAodiA/IDEgOiAwKSA6IDI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3N0cmluZ19nZXQgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGFyZzE7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnc3RyaW5nJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHB0cjAgPSBpc0xpa2VOb25lKHJldCkgPyAwIDogcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX251bWJlcl9nZXQgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGFyZzE7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnbnVtYmVyJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgZ2V0RmxvYXQ2NE1lbW9yeTAoKVthcmcwIC8gOCArIDFdID0gaXNMaWtlTm9uZShyZXQpID8gMCA6IHJldDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9ICFpc0xpa2VOb25lKHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Vycm9yX25ldyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2RlYnVnX3N0cmluZyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZGVidWdTdHJpbmcoYXJnMSk7XG4gICAgICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChyZXQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgY29uc3QgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAxXSA9IGxlbjA7XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSBwdHIwO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl90aHJvdyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2luaXRfZXh0ZXJucmVmX3RhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlID0gd2FzbS5fX3diaW5kZ2VuX2V4cG9ydF8yO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSB0YWJsZS5ncm93KDQpO1xuICAgICAgICB0YWJsZS5zZXQoMCwgdW5kZWZpbmVkKTtcbiAgICAgICAgdGFibGUuc2V0KG9mZnNldCArIDAsIHVuZGVmaW5lZCk7XG4gICAgICAgIHRhYmxlLnNldChvZmZzZXQgKyAxLCBudWxsKTtcbiAgICAgICAgdGFibGUuc2V0KG9mZnNldCArIDIsIHRydWUpO1xuICAgICAgICB0YWJsZS5zZXQob2Zmc2V0ICsgMywgZmFsc2UpO1xuICAgICAgICA7XG4gICAgfTtcblxuICAgIHJldHVybiBpbXBvcnRzO1xufVxuXG5mdW5jdGlvbiBpbml0TWVtb3J5KGltcG9ydHMsIG1heWJlX21lbW9yeSkge1xuXG59XG5cbmZ1bmN0aW9uIGZpbmFsaXplSW5pdChpbnN0YW5jZSwgbW9kdWxlKSB7XG4gICAgd2FzbSA9IGluc3RhbmNlLmV4cG9ydHM7XG4gICAgaW5pdC5fX3diaW5kZ2VuX3dhc21fbW9kdWxlID0gbW9kdWxlO1xuICAgIGNhY2hlZEZsb2F0NjRNZW1vcnkwID0gbmV3IEZsb2F0NjRBcnJheSgpO1xuICAgIGNhY2hlZEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KCk7XG4gICAgY2FjaGVkVWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHdhc20uX193YmluZGdlbl9zdGFydCgpO1xuICAgIHJldHVybiB3YXNtO1xufVxuXG5mdW5jdGlvbiBpbml0U3luYyhtb2R1bGUpIHtcbiAgICBjb25zdCBpbXBvcnRzID0gZ2V0SW1wb3J0cygpO1xuXG4gICAgaW5pdE1lbW9yeShpbXBvcnRzKTtcblxuICAgIGlmICghKG1vZHVsZSBpbnN0YW5jZW9mIFdlYkFzc2VtYmx5Lk1vZHVsZSkpIHtcbiAgICAgICAgbW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShtb2R1bGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICByZXR1cm4gZmluYWxpemVJbml0KGluc3RhbmNlLCBtb2R1bGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0KGlucHV0KSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaW5wdXQgPSBuZXcgVVJMKCdkZXRlY3Rvcl9iZy53YXNtJywgaW1wb3J0Lm1ldGEudXJsKTtcbiAgICB9XG4gICAgY29uc3QgaW1wb3J0cyA9IGdldEltcG9ydHMoKTtcblxuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnIHx8ICh0eXBlb2YgUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHx8ICh0eXBlb2YgVVJMID09PSAnZnVuY3Rpb24nICYmIGlucHV0IGluc3RhbmNlb2YgVVJMKSkge1xuICAgICAgICBpbnB1dCA9IGZldGNoKGlucHV0KTtcbiAgICB9XG5cbiAgICBpbml0TWVtb3J5KGltcG9ydHMpO1xuXG4gICAgY29uc3QgeyBpbnN0YW5jZSwgbW9kdWxlIH0gPSBhd2FpdCBsb2FkKGF3YWl0IGlucHV0LCBpbXBvcnRzKTtcblxuICAgIHJldHVybiBmaW5hbGl6ZUluaXQoaW5zdGFuY2UsIG1vZHVsZSk7XG59XG5cbmV4cG9ydCB7IGluaXRTeW5jIH1cbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG4iLCJcbmxldCB3YXNtO1xuXG5jb25zdCBoZWFwID0gbmV3IEFycmF5KDMyKS5maWxsKHVuZGVmaW5lZCk7XG5cbmhlYXAucHVzaCh1bmRlZmluZWQsIG51bGwsIHRydWUsIGZhbHNlKTtcblxuZnVuY3Rpb24gZ2V0T2JqZWN0KGlkeCkgeyByZXR1cm4gaGVhcFtpZHhdOyB9XG5cbmxldCBoZWFwX25leHQgPSBoZWFwLmxlbmd0aDtcblxuZnVuY3Rpb24gZHJvcE9iamVjdChpZHgpIHtcbiAgICBpZiAoaWR4IDwgMzYpIHJldHVybjtcbiAgICBoZWFwW2lkeF0gPSBoZWFwX25leHQ7XG4gICAgaGVhcF9uZXh0ID0gaWR4O1xufVxuXG5mdW5jdGlvbiB0YWtlT2JqZWN0KGlkeCkge1xuICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChpZHgpO1xuICAgIGRyb3BPYmplY3QoaWR4KTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBhZGRIZWFwT2JqZWN0KG9iaikge1xuICAgIGlmIChoZWFwX25leHQgPT09IGhlYXAubGVuZ3RoKSBoZWFwLnB1c2goaGVhcC5sZW5ndGggKyAxKTtcbiAgICBjb25zdCBpZHggPSBoZWFwX25leHQ7XG4gICAgaGVhcF9uZXh0ID0gaGVhcFtpZHhdO1xuXG4gICAgaGVhcFtpZHhdID0gb2JqO1xuICAgIHJldHVybiBpZHg7XG59XG5cbmNvbnN0IGNhY2hlZFRleHREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcsIHsgaWdub3JlQk9NOiB0cnVlLCBmYXRhbDogdHJ1ZSB9KTtcblxuY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKCk7XG5cbmxldCBjYWNoZWRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSgpO1xuXG5mdW5jdGlvbiBnZXRVaW50OE1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZFVpbnQ4TWVtb3J5MC5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhY2hlZFVpbnQ4TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRVaW50OE1lbW9yeTA7XG59XG5cbmZ1bmN0aW9uIGdldFN0cmluZ0Zyb21XYXNtMChwdHIsIGxlbikge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBsZW4pKTtcbn1cblxuZnVuY3Rpb24gaXNMaWtlTm9uZSh4KSB7XG4gICAgcmV0dXJuIHggPT09IHVuZGVmaW5lZCB8fCB4ID09PSBudWxsO1xufVxuXG5sZXQgY2FjaGVkRmxvYXQ2NE1lbW9yeTAgPSBuZXcgRmxvYXQ2NEFycmF5KCk7XG5cbmZ1bmN0aW9uIGdldEZsb2F0NjRNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWRGbG9hdDY0TWVtb3J5MC5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhY2hlZEZsb2F0NjRNZW1vcnkwID0gbmV3IEZsb2F0NjRBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkRmxvYXQ2NE1lbW9yeTA7XG59XG5cbmxldCBjYWNoZWRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSgpO1xuXG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZEludDMyTWVtb3J5MC5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhY2hlZEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRJbnQzMk1lbW9yeTA7XG59XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5jb25zdCBjYWNoZWRUZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuXG5mdW5jdGlvbiBkZWJ1Z1N0cmluZyh2YWwpIHtcbiAgICAvLyBwcmltaXRpdmUgdHlwZXNcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbDtcbiAgICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdib29sZWFuJyB8fCB2YWwgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gIGAke3ZhbH1gO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gYFwiJHt2YWx9XCJgO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnc3ltYm9sJykge1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHZhbC5kZXNjcmlwdGlvbjtcbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAnU3ltYm9sJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgU3ltYm9sKCR7ZGVzY3JpcHRpb259KWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBuYW1lID0gdmFsLm5hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJyAmJiBuYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgRnVuY3Rpb24oJHtuYW1lfSlgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdGdW5jdGlvbic7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gb2JqZWN0c1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdmFsLmxlbmd0aDtcbiAgICAgICAgbGV0IGRlYnVnID0gJ1snO1xuICAgICAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGVidWcgKz0gZGVidWdTdHJpbmcodmFsWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRlYnVnICs9ICcsICcgKyBkZWJ1Z1N0cmluZyh2YWxbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnICs9ICddJztcbiAgICAgICAgcmV0dXJuIGRlYnVnO1xuICAgIH1cbiAgICAvLyBUZXN0IGZvciBidWlsdC1pblxuICAgIGNvbnN0IGJ1aWx0SW5NYXRjaGVzID0gL1xcW29iamVjdCAoW15cXF1dKylcXF0vLmV4ZWModG9TdHJpbmcuY2FsbCh2YWwpKTtcbiAgICBsZXQgY2xhc3NOYW1lO1xuICAgIGlmIChidWlsdEluTWF0Y2hlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IGJ1aWx0SW5NYXRjaGVzWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZhaWxlZCB0byBtYXRjaCB0aGUgc3RhbmRhcmQgJ1tvYmplY3QgQ2xhc3NOYW1lXSdcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKTtcbiAgICB9XG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnT2JqZWN0Jykge1xuICAgICAgICAvLyB3ZSdyZSBhIHVzZXIgZGVmaW5lZCBjbGFzcyBvciBPYmplY3RcbiAgICAgICAgLy8gSlNPTi5zdHJpbmdpZnkgYXZvaWRzIHByb2JsZW1zIHdpdGggY3ljbGVzLCBhbmQgaXMgZ2VuZXJhbGx5IG11Y2hcbiAgICAgICAgLy8gZWFzaWVyIHRoYW4gbG9vcGluZyB0aHJvdWdoIG93blByb3BlcnRpZXMgb2YgYHZhbGAuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gJ09iamVjdCgnICsgSlNPTi5zdHJpbmdpZnkodmFsKSArICcpJztcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgICAgcmV0dXJuICdPYmplY3QnO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGVycm9yc1xuICAgIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICByZXR1cm4gYCR7dmFsLm5hbWV9OiAke3ZhbC5tZXNzYWdlfVxcbiR7dmFsLnN0YWNrfWA7XG4gICAgfVxuICAgIC8vIFRPRE8gd2UgY291bGQgdGVzdCBmb3IgbW9yZSB0aGluZ3MgaGVyZSwgbGlrZSBgU2V0YHMgYW5kIGBNYXBgcy5cbiAgICByZXR1cm4gY2xhc3NOYW1lO1xufVxuXG5jb25zdCBDTE9TVVJFX0RUT1JTID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KHN0YXRlID0+IHtcbiAgICB3YXNtLl9fd2JpbmRnZW5fZXhwb3J0XzIuZ2V0KHN0YXRlLmR0b3IpKHN0YXRlLmEsIHN0YXRlLmIpXG59KTtcblxuZnVuY3Rpb24gbWFrZU11dENsb3N1cmUoYXJnMCwgYXJnMSwgZHRvciwgZikge1xuICAgIGNvbnN0IHN0YXRlID0geyBhOiBhcmcwLCBiOiBhcmcxLCBjbnQ6IDEsIGR0b3IgfTtcbiAgICBjb25zdCByZWFsID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgLy8gRmlyc3QgdXAgd2l0aCBhIGNsb3N1cmUgd2UgaW5jcmVtZW50IHRoZSBpbnRlcm5hbCByZWZlcmVuY2VcbiAgICAgICAgLy8gY291bnQuIFRoaXMgZW5zdXJlcyB0aGF0IHRoZSBSdXN0IGNsb3N1cmUgZW52aXJvbm1lbnQgd29uJ3RcbiAgICAgICAgLy8gYmUgZGVhbGxvY2F0ZWQgd2hpbGUgd2UncmUgaW52b2tpbmcgaXQuXG4gICAgICAgIHN0YXRlLmNudCsrO1xuICAgICAgICBjb25zdCBhID0gc3RhdGUuYTtcbiAgICAgICAgc3RhdGUuYSA9IDA7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZihhLCBzdGF0ZS5iLCAuLi5hcmdzKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGlmICgtLXN0YXRlLmNudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9leHBvcnRfMi5nZXQoc3RhdGUuZHRvcikoYSwgc3RhdGUuYik7XG4gICAgICAgICAgICAgICAgQ0xPU1VSRV9EVE9SUy51bnJlZ2lzdGVyKHN0YXRlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hID0gYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVhbC5vcmlnaW5hbCA9IHN0YXRlO1xuICAgIENMT1NVUkVfRFRPUlMucmVnaXN0ZXIocmVhbCwgc3RhdGUsIHN0YXRlKTtcbiAgICByZXR1cm4gcmVhbDtcbn1cbmZ1bmN0aW9uIF9fd2JnX2FkYXB0ZXJfMzgoYXJnMCwgYXJnMSwgYXJnMikge1xuICAgIHdhc20ud2FzbV9iaW5kZ2VuX19jb252ZXJ0X19jbG9zdXJlc19faW52b2tlMV9tdXRfX2hmYWUwNGJkNmJhYzQzNmJjKGFyZzAsIGFyZzEsIGFkZEhlYXBPYmplY3QoYXJnMikpO1xufVxuXG4vKipcbiovXG5leHBvcnQgZnVuY3Rpb24gcnVuKCkge1xuICAgIHdhc20ucnVuKCk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge2FueX0gYnVmXG4qIEBwYXJhbSB7c3RyaW5nfSBtaW1lX3R5cGVcbiogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFuaWZlc3RTdG9yZUZyb21BcnJheUJ1ZmZlcihidWYsIG1pbWVfdHlwZSkge1xuICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChtaW1lX3R5cGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICBjb25zdCBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIGNvbnN0IHJldCA9IHdhc20uZ2V0TWFuaWZlc3RTdG9yZUZyb21BcnJheUJ1ZmZlcihhZGRIZWFwT2JqZWN0KGJ1ZiksIHB0cjAsIGxlbjApO1xuICAgIHJldHVybiB0YWtlT2JqZWN0KHJldCk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge2FueX0gbWFuaWZlc3RfYnVmZmVyXG4qIEBwYXJhbSB7YW55fSBhc3NldF9idWZmZXJcbiogQHBhcmFtIHtzdHJpbmd9IG1pbWVfdHlwZVxuKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYW5pZmVzdFN0b3JlRnJvbU1hbmlmZXN0QW5kQXNzZXQobWFuaWZlc3RfYnVmZmVyLCBhc3NldF9idWZmZXIsIG1pbWVfdHlwZSkge1xuICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChtaW1lX3R5cGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICBjb25zdCBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIGNvbnN0IHJldCA9IHdhc20uZ2V0TWFuaWZlc3RTdG9yZUZyb21NYW5pZmVzdEFuZEFzc2V0KGFkZEhlYXBPYmplY3QobWFuaWZlc3RfYnVmZmVyKSwgYWRkSGVhcE9iamVjdChhc3NldF9idWZmZXIpLCBwdHIwLCBsZW4wKTtcbiAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVFcnJvcihmLCBhcmdzKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZXhuX3N0b3JlKGFkZEhlYXBPYmplY3QoZSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0QXJyYXlVOEZyb21XYXNtMChwdHIsIGxlbikge1xuICAgIHJldHVybiBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIgLyAxLCBwdHIgLyAxICsgbGVuKTtcbn1cbmZ1bmN0aW9uIF9fd2JnX2FkYXB0ZXJfMTA2KGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICB3YXNtLndhc21fYmluZGdlbl9fY29udmVydF9fY2xvc3VyZXNfX2ludm9rZTJfbXV0X19oZWVjMWRkMTBkNjM3Y2JmMihhcmcwLCBhcmcxLCBhZGRIZWFwT2JqZWN0KGFyZzIpLCBhZGRIZWFwT2JqZWN0KGFyZzMpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZChtb2R1bGUsIGltcG9ydHMpIHtcbiAgICBpZiAodHlwZW9mIFJlc3BvbnNlID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZSBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSAhPSAnYXBwbGljYXRpb24vd2FzbScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nYCBmYWlsZWQgYmVjYXVzZSB5b3VyIHNlcnZlciBkb2VzIG5vdCBzZXJ2ZSB3YXNtIHdpdGggYGFwcGxpY2F0aW9uL3dhc21gIE1JTUUgdHlwZS4gRmFsbGluZyBiYWNrIHRvIGBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZWAgd2hpY2ggaXMgc2xvd2VyLiBPcmlnaW5hbCBlcnJvcjpcXG5cIiwgZSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgbW9kdWxlLmFycmF5QnVmZmVyKCk7XG4gICAgICAgIHJldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShieXRlcywgaW1wb3J0cyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGluc3RhbmNlLCBtb2R1bGUgfTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRJbXBvcnRzKCkge1xuICAgIGNvbnN0IGltcG9ydHMgPSB7fTtcbiAgICBpbXBvcnRzLndiZyA9IHt9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fb2JqZWN0X2Ryb3BfcmVmID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICB0YWtlT2JqZWN0KGFyZzApO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfY2FsbF8xNjhkYTg4Nzc5ZTM1ZjYxID0gZnVuY3Rpb24oKSB7IHJldHVybiBoYW5kbGVFcnJvcihmdW5jdGlvbiAoYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuY2FsbChnZXRPYmplY3QoYXJnMSksIGdldE9iamVjdChhcmcyKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fb2JqZWN0X2Nsb25lX3JlZiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfV2luZG93XzMxNDRhNmNlYmY5YTg3N2MgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5XaW5kb3c7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2lzX3VuZGVmaW5lZCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19Xb3JrZXJHbG9iYWxTY29wZV8xNzQ0ZDZhNzgyZDNjY2E4ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuV29ya2VyR2xvYmFsU2NvcGU7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19jcnlwdG9fOWYwN2JlYjFlOTdiZmExYiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmNyeXB0bztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfY3J5cHRvXzY2NzMwNmRkYTE0YzRmMGQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5jcnlwdG87XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3N1YnRsZV82NTViZDZjM2Y0ZDU5OGJiID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuc3VidGxlO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3XzFkOWE5MjBjNmJmYzQ0YTggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3N0cmluZ19uZXcgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3B1c2hfNzQwZTRiMjg2NzAyZDk2NCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnB1c2goZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2RlYnVnX2FhNzkyMjE3MjZkN2UwNDMgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoZ2V0T2JqZWN0KGFyZzApLCBnZXRPYmplY3QoYXJnMSkpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3XzBiOWJmZGQ5NzU4MzI4NGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IE9iamVjdCgpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfdmVyaWZ5XzViMWFhMmYyNjMwN2U4N2IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS52ZXJpZnkoZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSwgZ2V0T2JqZWN0KGFyZzQpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9pc19mYWxzeSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gIWdldE9iamVjdChhcmcwKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX25ld3dpdGhsZW5ndGhfZjU5MzM4NTVlNGY0OGExOSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVpbnQ4QXJyYXkoYXJnMCA+Pj4gMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19sZW5ndGhfOWUxYWUxOTAwY2IwZmJkNSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3NldF84M2RiOTY5MGY5MzUzZTc5ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBnZXRPYmplY3QoYXJnMCkuc2V0KGdldE9iamVjdChhcmcxKSwgYXJnMiA+Pj4gMCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19idWZmZXJfMjEzMTBlYTE3MjU3YjBiNCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmJ1ZmZlcjtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fbnVtYmVyX25ldyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gYXJnMDtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3NldF9hNjgyMTRmMzVjNDE3ZmE5ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBnZXRPYmplY3QoYXJnMClbYXJnMSA+Pj4gMF0gPSB0YWtlT2JqZWN0KGFyZzIpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3XzI2OGY3YjdkZDM0MzA3OTggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IE1hcCgpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc2V0X2JkNzJjMDc4ZWRmYTUxYWQgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGdldE9iamVjdChhcmcwKVt0YWtlT2JqZWN0KGFyZzEpXSA9IHRha2VPYmplY3QoYXJnMik7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfOTMzNzI5Y2Y1YjY2YWMxMSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnNldChnZXRPYmplY3QoYXJnMSksIGdldE9iamVjdChhcmcyKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2lzX3N0cmluZyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gdHlwZW9mKGdldE9iamVjdChhcmcwKSkgPT09ICdzdHJpbmcnO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfbm93XzU4ODg2NjgyYjdlNzkwZDcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fYmlnaW50X2Zyb21fdTY0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBCaWdJbnQuYXNVaW50Tig2NCwgYXJnMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfOGMzZjAwNTIyNzJhNDU3YSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVpbnQ4QXJyYXkoZ2V0T2JqZWN0KGFyZzApKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2Zyb21fN2NlM2NiMjdjYjI1ODU2OSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gQXJyYXkuZnJvbShnZXRPYmplY3QoYXJnMCkpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfU3RyaW5nXzQzNzBjNTUwNWM2NzRkMzAgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IFN0cmluZyhnZXRPYmplY3QoYXJnMSkpO1xuICAgICAgICBjb25zdCBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIGNvbnN0IGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMV0gPSBsZW4wO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDBdID0gcHRyMDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX25ld184ZDJhZjAwYmMxZTMyOWVlID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3NldG5hbWVfZDI2Y2VmZDQzZWEzYTA4MiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgZ2V0T2JqZWN0KGFyZzApLm5hbWUgPSBnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMSwgYXJnMik7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfOTk2MmY5MzkyMTlmMTgyMCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzdGF0ZTAgPSB7YTogYXJnMCwgYjogYXJnMX07XG4gICAgICAgICAgICB2YXIgY2IwID0gKGFyZzAsIGFyZzEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gc3RhdGUwLmE7XG4gICAgICAgICAgICAgICAgc3RhdGUwLmEgPSAwO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfX3diZ19hZGFwdGVyXzEwNihhLCBzdGF0ZTAuYiwgYXJnMCwgYXJnMSk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUwLmEgPSBhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCByZXQgPSBuZXcgUHJvbWlzZShjYjApO1xuICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHN0YXRlMC5hID0gc3RhdGUwLmIgPSAwO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Vycm9yX25ldyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pc0FycmF5XzI3YzQ2YzY3ZjQ5OGUxNWQgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IEFycmF5LmlzQXJyYXkoZ2V0T2JqZWN0KGFyZzApKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2xlbmd0aF82ZTNiYmU3YzhiZDRkYmQ4ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZ2V0XzU3MjQ1Y2M3ZDdjNzYxOWQgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKVthcmcxID4+PiAwXTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fbnVtYmVyX2dldCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gZ2V0T2JqZWN0KGFyZzEpO1xuICAgICAgICBjb25zdCByZXQgPSB0eXBlb2Yob2JqKSA9PT0gJ251bWJlcicgPyBvYmogOiB1bmRlZmluZWQ7XG4gICAgICAgIGdldEZsb2F0NjRNZW1vcnkwKClbYXJnMCAvIDggKyAxXSA9IGlzTGlrZU5vbmUocmV0KSA/IDAgOiByZXQ7XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSAhaXNMaWtlTm9uZShyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaXNTYWZlSW50ZWdlcl9kZmEwNTkzZThkN2FjMzVhID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBOdW1iZXIuaXNTYWZlSW50ZWdlcihnZXRPYmplY3QoYXJnMCkpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3X2FiZGE3NmU4ODNiYThhNWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdGFja182NTgyNzlmZTQ0NTQxY2Y2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMSkuc3RhY2s7XG4gICAgICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChyZXQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgY29uc3QgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAxXSA9IGxlbjA7XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSBwdHIwO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZXJyb3JfZjg1MTY2N2FmNzFiY2ZjNiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKGFyZzAsIGFyZzEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19wcm9jZXNzXzBjYzJhZGE4NTI0ZDZmODMgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5wcm9jZXNzO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9pc19vYmplY3QgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGdldE9iamVjdChhcmcwKTtcbiAgICAgICAgY29uc3QgcmV0ID0gdHlwZW9mKHZhbCkgPT09ICdvYmplY3QnICYmIHZhbCAhPT0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3ZlcnNpb25zX2MxMWFjY2VhYjI3YTZjODcgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS52ZXJzaW9ucztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX25vZGVfN2ZmMWNlNDljYWYyMzgxNSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLm5vZGU7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdGF0aWNfYWNjZXNzb3JfTk9ERV9NT0RVTEVfY2Y2NDAxY2MxMDkxMjc5ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSBtb2R1bGU7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19yZXF1aXJlX2E3NDZlNzliMzIyYjkzMzYgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5yZXF1aXJlKGdldFN0cmluZ0Zyb21XYXNtMChhcmcxLCBhcmcyKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2NyeXB0b18yMDM2YmVkN2M0NGMyNWU3ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuY3J5cHRvO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbXNDcnlwdG9fYTIxZmM4OGNhZjFlY2RjOCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLm1zQ3J5cHRvO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfcmFuZG9tRmlsbFN5bmNfMDY1YWZmZmRlMDFkYWE2NiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgZ2V0T2JqZWN0KGFyZzApLnJhbmRvbUZpbGxTeW5jKGdldEFycmF5VThGcm9tV2FzbTAoYXJnMSwgYXJnMikpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdWJhcnJheV81OGFkNGVmYmI1YmNiODg2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuc3ViYXJyYXkoYXJnMSA+Pj4gMCwgYXJnMiA+Pj4gMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nZXRSYW5kb21WYWx1ZXNfYjk5ZWVjNDI0NGE0NzViYiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgZ2V0T2JqZWN0KGFyZzApLmdldFJhbmRvbVZhbHVlcyhnZXRPYmplY3QoYXJnMSkpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZWxmXzZkNDc5NTA2ZjcyYzZhNzEgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gc2VsZi5zZWxmO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ193aW5kb3dfZjI1NTdjYzc4NDkwYWNlYiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3aW5kb3cud2luZG93O1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nbG9iYWxUaGlzXzdmMjA2YmRhNjI4ZDUyODYgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2xvYmFsVGhpcy5nbG9iYWxUaGlzO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nbG9iYWxfYmE3NWM1MGQxY2YzODRmNCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByZXQgPSBnbG9iYWwuZ2xvYmFsO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdub2FyZ3NfYjViMDYzZmM2YzJmMDM3NiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEZ1bmN0aW9uKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19jYWxsXzk3YWU5ZDg2NDVkYzM4OGIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5jYWxsKGdldE9iamVjdChhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fbWVtb3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ubWVtb3J5O1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfYnVmZmVyXzNmM2Q3NjRkNDc0N2Q1NjQgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5idWZmZXI7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXd3aXRoYnl0ZW9mZnNldGFuZGxlbmd0aF9kOWFhMjY2NzAzY2I5OGJlID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgVWludDhBcnJheShnZXRPYmplY3QoYXJnMCksIGFyZzEgPj4+IDAsIGFyZzIgPj4+IDApO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc2V0X2JmM2Y4OWI5MmQ1YTM0YmYgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IFJlZmxlY3Quc2V0KGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMikpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pbnN0YW5jZW9mX1VpbnQ4QXJyYXlfOTcxZWVkYTY5ZWI3NTAwMyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGdldE9iamVjdChhcmcwKSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXk7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmV0ID0gcmVzdWx0O1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaW5zdGFuY2VvZl9BcnJheUJ1ZmZlcl9lNWU0OGY0NzYyYzU2MTBiID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gZ2V0T2JqZWN0KGFyZzApIGluc3RhbmNlb2YgQXJyYXlCdWZmZXI7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmV0ID0gcmVzdWx0O1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9qc3ZhbF9sb29zZV9lcSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApID09IGdldE9iamVjdChhcmcxKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fYm9vbGVhbl9nZXQgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHYgPSBnZXRPYmplY3QoYXJnMCk7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZih2KSA9PT0gJ2Jvb2xlYW4nID8gKHYgPyAxIDogMCkgOiAyO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9zdHJpbmdfZ2V0ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCBvYmogPSBnZXRPYmplY3QoYXJnMSk7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnc3RyaW5nJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHB0cjAgPSBpc0xpa2VOb25lKHJldCkgPyAwIDogcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2RlYnVnX3N0cmluZyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZGVidWdTdHJpbmcoZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgY29uc3QgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHJldCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICBjb25zdCBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3Rocm93ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3RoZW5fY2VkYWQyMGZiYmQ5NDE4YSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnRoZW4oZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMikpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfcmVzb2x2ZV85OWZlMTc5NjRmMzFmZmMwID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBQcm9taXNlLnJlc29sdmUoZ2V0T2JqZWN0KGFyZzApKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3RoZW5fMTFmN2E1NGQ2N2I0YmZhZCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnRoZW4oZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fY2JfZHJvcCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3Qgb2JqID0gdGFrZU9iamVjdChhcmcwKS5vcmlnaW5hbDtcbiAgICAgICAgaWYgKG9iai5jbnQtLSA9PSAxKSB7XG4gICAgICAgICAgICBvYmouYSA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2RlYnVnXzY0NzExZWIyZmM2OTgwZWYgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoZ2V0T2JqZWN0KGFyZzApLCBnZXRPYmplY3QoYXJnMSksIGdldE9iamVjdChhcmcyKSwgZ2V0T2JqZWN0KGFyZzMpKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2Vycm9yXzAwYzVkNTcxZjc1NGY2MjkgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2V0T2JqZWN0KGFyZzApLCBnZXRPYmplY3QoYXJnMSksIGdldE9iamVjdChhcmcyKSwgZ2V0T2JqZWN0KGFyZzMpKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2luZm9fZDYwYTk2MGE0ZTk1NWRjMiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19sb2dfZGUyNThmNjZhZDllYjc4NCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgY29uc29sZS5sb2coZ2V0T2JqZWN0KGFyZzApLCBnZXRPYmplY3QoYXJnMSksIGdldE9iamVjdChhcmcyKSwgZ2V0T2JqZWN0KGFyZzMpKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3dhcm5fYmU1NDI1MDFhNTczODdhNSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pbXBvcnRLZXlfYzdkYTc0YTU4MjFmYzcyMSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUsIGFyZzYpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmltcG9ydEtleShnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMSwgYXJnMiksIGdldE9iamVjdChhcmczKSwgZ2V0T2JqZWN0KGFyZzQpLCBhcmc1ICE9PSAwLCBnZXRPYmplY3QoYXJnNikpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Nsb3N1cmVfd3JhcHBlcjQyMDUgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG1ha2VNdXRDbG9zdXJlKGFyZzAsIGFyZzEsIDExNiwgX193YmdfYWRhcHRlcl8zOCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcblxuICAgIHJldHVybiBpbXBvcnRzO1xufVxuXG5mdW5jdGlvbiBpbml0TWVtb3J5KGltcG9ydHMsIG1heWJlX21lbW9yeSkge1xuXG59XG5cbmZ1bmN0aW9uIGZpbmFsaXplSW5pdChpbnN0YW5jZSwgbW9kdWxlKSB7XG4gICAgd2FzbSA9IGluc3RhbmNlLmV4cG9ydHM7XG4gICAgaW5pdC5fX3diaW5kZ2VuX3dhc21fbW9kdWxlID0gbW9kdWxlO1xuICAgIGNhY2hlZEZsb2F0NjRNZW1vcnkwID0gbmV3IEZsb2F0NjRBcnJheSgpO1xuICAgIGNhY2hlZEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KCk7XG4gICAgY2FjaGVkVWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHdhc20uX193YmluZGdlbl9zdGFydCgpO1xuICAgIHJldHVybiB3YXNtO1xufVxuXG5mdW5jdGlvbiBpbml0U3luYyhtb2R1bGUpIHtcbiAgICBjb25zdCBpbXBvcnRzID0gZ2V0SW1wb3J0cygpO1xuXG4gICAgaW5pdE1lbW9yeShpbXBvcnRzKTtcblxuICAgIGlmICghKG1vZHVsZSBpbnN0YW5jZW9mIFdlYkFzc2VtYmx5Lk1vZHVsZSkpIHtcbiAgICAgICAgbW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShtb2R1bGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICByZXR1cm4gZmluYWxpemVJbml0KGluc3RhbmNlLCBtb2R1bGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0KGlucHV0KSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaW5wdXQgPSBuZXcgVVJMKCd0b29sa2l0X2JnLndhc20nLCBpbXBvcnQubWV0YS51cmwpO1xuICAgIH1cbiAgICBjb25zdCBpbXBvcnRzID0gZ2V0SW1wb3J0cygpO1xuXG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgfHwgKHR5cGVvZiBSZXF1ZXN0ID09PSAnZnVuY3Rpb24nICYmIGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkgfHwgKHR5cGVvZiBVUkwgPT09ICdmdW5jdGlvbicgJiYgaW5wdXQgaW5zdGFuY2VvZiBVUkwpKSB7XG4gICAgICAgIGlucHV0ID0gZmV0Y2goaW5wdXQpO1xuICAgIH1cblxuICAgIGluaXRNZW1vcnkoaW1wb3J0cyk7XG5cbiAgICBjb25zdCB7IGluc3RhbmNlLCBtb2R1bGUgfSA9IGF3YWl0IGxvYWQoYXdhaXQgaW5wdXQsIGltcG9ydHMpO1xuXG4gICAgcmV0dXJuIGZpbmFsaXplSW5pdChpbnN0YW5jZSwgbW9kdWxlKTtcbn1cblxuZXhwb3J0IHsgaW5pdFN5bmMgfVxuZXhwb3J0IGRlZmF1bHQgaW5pdDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMjEgQWRvYmVcbiAqIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTk9USUNFOiBBZG9iZSBwZXJtaXRzIHlvdSB0byB1c2UsIG1vZGlmeSwgYW5kIGRpc3RyaWJ1dGUgdGhpcyBmaWxlIGluXG4gKiBhY2NvcmRhbmNlIHdpdGggdGhlIHRlcm1zIG9mIHRoZSBBZG9iZSBsaWNlbnNlIGFncmVlbWVudCBhY2NvbXBhbnlpbmdcbiAqIGl0LlxuICovXG5cbmltcG9ydCB7IHNldHVwV29ya2VyIH0gZnJvbSAnLi9zcmMvbGliL3Bvb2wvd29ya2VyJztcblxuaW1wb3J0IHtcbiAgZGVmYXVsdCBhcyBpbml0RGV0ZWN0b3IsXG4gIHNjYW5fYXJyYXlfYnVmZmVyLFxufSBmcm9tICdAY29udGVudGF1dGgvZGV0ZWN0b3InO1xuaW1wb3J0IHtcbiAgTWFuaWZlc3RTdG9yZSxcbiAgZ2V0TWFuaWZlc3RTdG9yZUZyb21BcnJheUJ1ZmZlcixcbiAgZ2V0TWFuaWZlc3RTdG9yZUZyb21NYW5pZmVzdEFuZEFzc2V0LFxuICBkZWZhdWx0IGFzIGluaXRUb29sa2l0LFxufSBmcm9tICdAY29udGVudGF1dGgvdG9vbGtpdCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNjYW5SZXN1bHQge1xuICBmb3VuZDogYm9vbGVhbjtcbiAgb2Zmc2V0PzogbnVtYmVyO1xufVxuXG5jb25zdCB3b3JrZXIgPSB7XG4gIGFzeW5jIGNvbXBpbGVXYXNtKGJ1ZmZlcjogQXJyYXlCdWZmZXIpOiBQcm9taXNlPFdlYkFzc2VtYmx5Lk1vZHVsZT4ge1xuICAgIHJldHVybiBXZWJBc3NlbWJseS5jb21waWxlKGJ1ZmZlcik7XG4gIH0sXG4gIGFzeW5jIGdldFJlcG9ydChcbiAgICB3YXNtOiBXZWJBc3NlbWJseS5Nb2R1bGUsXG4gICAgYnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgICB0eXBlOiBzdHJpbmcsXG4gICk6IFByb21pc2U8TWFuaWZlc3RTdG9yZT4ge1xuICAgIGF3YWl0IGluaXRUb29sa2l0KHdhc20pO1xuICAgIHJldHVybiBnZXRNYW5pZmVzdFN0b3JlRnJvbUFycmF5QnVmZmVyKGJ1ZmZlciwgdHlwZSk7XG4gIH0sXG4gIGFzeW5jIGdldFJlcG9ydEZyb21Bc3NldEFuZE1hbmlmZXN0QnVmZmVyKFxuICAgIHdhc206IFdlYkFzc2VtYmx5Lk1vZHVsZSxcbiAgICBtYW5pZmVzdEJ1ZmZlcjogQXJyYXlCdWZmZXIsXG4gICAgYXNzZXQ6IEJsb2IsXG4gICkge1xuICAgIGF3YWl0IGluaXRUb29sa2l0KHdhc20pO1xuICAgIGNvbnN0IGFzc2V0QnVmZmVyID0gYXdhaXQgYXNzZXQuYXJyYXlCdWZmZXIoKTtcbiAgICByZXR1cm4gZ2V0TWFuaWZlc3RTdG9yZUZyb21NYW5pZmVzdEFuZEFzc2V0KFxuICAgICAgbWFuaWZlc3RCdWZmZXIsXG4gICAgICBhc3NldEJ1ZmZlcixcbiAgICAgIGFzc2V0LnR5cGUsXG4gICAgKTtcbiAgfSxcbiAgYXN5bmMgc2NhbklucHV0KFxuICAgIHdhc206IFdlYkFzc2VtYmx5Lk1vZHVsZSxcbiAgICBidWZmZXI6IEFycmF5QnVmZmVyLFxuICApOiBQcm9taXNlPElTY2FuUmVzdWx0PiB7XG4gICAgYXdhaXQgaW5pdERldGVjdG9yKHdhc20pO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvZmZzZXQgPSBhd2FpdCBzY2FuX2FycmF5X2J1ZmZlcihidWZmZXIpO1xuICAgICAgcmV0dXJuIHsgZm91bmQ6IHRydWUsIG9mZnNldCB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgZm91bmQ6IGZhbHNlIH07XG4gICAgfVxuICB9LFxufTtcblxuZXhwb3J0IHR5cGUgV29ya2VyID0gdHlwZW9mIHdvcmtlcjtcblxuc2V0dXBXb3JrZXIod29ya2VyKTtcbiJdLCJuYW1lcyI6WyJ3YXNtIiwiY2FjaGVkVGV4dERlY29kZXIiLCJjYWNoZWRVaW50OE1lbW9yeTAiLCJnZXRVaW50OE1lbW9yeTAiLCJnZXRTdHJpbmdGcm9tV2FzbTAiLCJXQVNNX1ZFQ1RPUl9MRU4iLCJjYWNoZWRUZXh0RW5jb2RlciIsImVuY29kZVN0cmluZyIsInBhc3NTdHJpbmdUb1dhc20wIiwiaXNMaWtlTm9uZSIsImNhY2hlZEludDMyTWVtb3J5MCIsImdldEludDMyTWVtb3J5MCIsImNhY2hlZEZsb2F0NjRNZW1vcnkwIiwiZ2V0RmxvYXQ2NE1lbW9yeTAiLCJkZWJ1Z1N0cmluZyIsImxvYWQiLCJnZXRJbXBvcnRzIiwiZmluYWxpemVJbml0IiwiaW5pdCIsImluaXRUb29sa2l0IiwiaW5pdERldGVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7OztJQU9HO0lBTUg7SUFDTSxTQUFVLGNBQWMsQ0FBQyxLQUEwQixFQUFBO0lBQ3ZELElBQUEsT0FBTyxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsT0FBTyxFQUFFLElBQUksRUFBQTtJQUNyRSxRQUFBLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0lBQzFDLFlBQUEsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDbEIsWUFBQSxVQUFVLEVBQUUsSUFBSTtJQUNqQixTQUFBLENBQUMsQ0FBQztTQUNKLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDVDs7SUNyQkE7Ozs7Ozs7SUFPRztJQXVCRyxTQUFVLFdBQVcsQ0FBQyxPQUFzQixFQUFBO0lBQ2hELElBQUEsU0FBUyxHQUFHLE9BQU8sQ0FBOEIsS0FBSTtZQUNuRCxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDaEMsSUFBSTtnQkFDRixNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRTNDLFlBQUEsV0FBVyxDQUFDO0lBQ1YsZ0JBQUEsSUFBSSxFQUFFLFNBQVM7SUFDZixnQkFBQSxJQUFJLEVBQUUsR0FBRztJQUNRLGFBQUEsQ0FBQyxDQUFDO0lBQ3RC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
