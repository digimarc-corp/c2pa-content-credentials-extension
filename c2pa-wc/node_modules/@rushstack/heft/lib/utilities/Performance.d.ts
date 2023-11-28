export declare type PerformanceMeasurer = <TResult extends object | void>(measurementName: string, fn: () => TResult) => TResult & {
    duration: number;
};
export declare type PerformanceMeasurerAsync = <TResult extends object | void>(measurementName: string, fn: () => Promise<TResult>) => Promise<TResult & {
    duration: number;
}>;
//# sourceMappingURL=Performance.d.ts.map