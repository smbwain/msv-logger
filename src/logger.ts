import colors from 'colors/safe';

import {Profiler, Params, LoggerInterface} from "../types";

function pad2(n : number) : string {
    return (n < 10 ? '0' : '') + n;
}

function pad3(n : number) : string {
    return (n < 10 ? '00' : n < 100 ? '0' : '') + n;
}

function time() : string {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function mtime() : string {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}.${pad3(d.getMilliseconds())}`;
}

class Logger implements LoggerInterface {
    private tags : string[];
    private level : number;

    constructor({
        tag = [],
        level = 4
    } : Params = {}) {
        this.tags = Array.isArray(tag) ? tag : [tag];
        this.level = level;
    }

    error(...msg : any[]) : void {
        if(this.level >= 1) {
            let err = msg.pop();
            if (typeof err == 'object' && err && err.name && err.message && err.stack) {
                err = `{${err.name}} ${err.message}\n${err.stack && err.stack.split('\n').slice(1).join('\n')}`;
            }
            console.error(colors.red(`[${time()}] ERROR${this.tags.map(tag => ' #' + tag).join('')}`), ...msg, err);
        }
    }

    warn(...msg : any[]) : void {
        if (this.level >= 2) {
            console.log(colors.magenta(`[${time()}] WARNING${this.tags.map(tag => ' #' + tag).join('')}`), ...msg);
        }
    }

    log(...msg : any[]) : void {
        if (this.level >= 3) {
            console.log(colors.gray(`[${time()}] LOG${this.tags.map(tag => ' #' + tag).join('')}`), ...msg);
        }
    }

    debug(...msg : any[]) : void {
        if (this.level >= 4) {
            console.log(colors.blue(`[${time()}] DEBUG${this.tags.map(tag => ' #' + tag).join('')}`), ...msg);
        }
    }

    sub({
        tag = [],
        level
    } : Params = {}) : Logger {
        return new Logger({
            tag: [...this.tags, ...(Array.isArray(tag) ? tag : [tag])],
            level: level != null ? level : this.level
        });
    }

    profiler(label1 : string) : Profiler{
        if (this.level >= 5) {
            return (label2) => {
                console.log(colors.white(`[${mtime()}] PROFILE${this.tags.map(tag => ' #' + tag).join('')} #profile:${label1}`)+' '+label2);
            };
        } else {
            return () => {};
        }
    }
}

export function logger(params: Params) : Logger {
    return new Logger(params);
}