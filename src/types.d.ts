
export type Profiler = (label : string) => void;

export type Logger = {
    error(...msg : any[]) : void;
    warn(...msg : any[]) : void;
    log(...msg : any[]) : void;
    debug(...msg : any[]) : void;
    sub(params? : Params) : Logger;
    profiler(name : string) : Profiler;
}

export enum Level {
    none,
    error,
    warn,
    log,
    debug,
    profile
}

export type Params = {
    tag?: string[] | string,
    level?: number
};

/*export class Logger implements LoggerInterface {
    constructor(params?: Params);
    error(...msg : any[]) : void;
    warn(...msg : any[]) : void;
    log(...msg : any[]) : void;
    debug(...msg : any[]) : void;
    sub(params?: Params) : Logger;
    profiler(name : string) : Profiler;
}*/

export function logger(params: Params) : Logger;