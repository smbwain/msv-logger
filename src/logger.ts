export * from './types';

import * as colors from 'colors/safe';

import {Profiler, Params, Logger} from "./types";

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

export function logger(params: Params) : Logger {
    const tags : string[] = Array.isArray(params.tag) ? params.tag : params.tag ? [params.tag] : [];
    const level : number = params.level != undefined ? params.level : 4;

    return {
        error: (...msg: any[]): void => {
            if (level >= 1) {
                let err = msg.pop();
                if (typeof err == 'object' && err && err.name && err.message && err.stack) {
                    err = `{${err.name}} ${err.message}\n${err.stack && err.stack.split('\n').slice(1).join('\n')}`;
                }
                console.error(colors.red(`[${time()}] ERROR${tags.map(tag => ' #' + tag).join('')}`), ...msg, err);
            }
        },

        warn: (...msg: any[]): void => {
            if (level >= 2) {
                console.log(colors.magenta(`[${time()}] WARNING${tags.map(tag => ' #' + tag).join('')}`), ...msg);
            }
        },

        log: (...msg: any[]): void => {
            if (level >= 3) {
                console.log(colors.gray(`[${time()}] LOG${tags.map(tag => ' #' + tag).join('')}`), ...msg);
            }
        },

        debug: (...msg: any[]): void => {
            if (level >= 4) {
                console.log(colors.blue(`[${time()}] DEBUG${tags.map(tag => ' #' + tag).join('')}`), ...msg);
            }
        },

        sub: ({
                tag: newTag = [],
                level: newLevel
            }: Params = {}): Logger => {
            return logger({
                tag: [...tags, ...(Array.isArray(newTag) ? newTag : [newTag])],
                level: newLevel != null ? newLevel : level
            });
        },

        profiler: (label1: string): Profiler => {
            if (level >= 5) {
                return (label2) => {
                    console.log(colors.white(`[${mtime()}] PROFILE${tags.map(tag => ' #' + tag).join('')} #profile:${label1}`) + ' ' + label2);
                };
            } else {
                return () => {
                };
            }
        }
    }
}