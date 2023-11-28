export declare const injectExportOrderPlugin: {
    name: string;
    enforce: string;
    transform(code: string, id: string): Promise<{
        code: string;
        map: import("magic-string").SourceMap;
    } | undefined>;
};
