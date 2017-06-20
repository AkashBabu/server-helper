export interface ICallback {
    (err?: string, result?: object[] | object): any
}

export interface IMiddleware {
    (req: any, res: any, next?: any): void;
}

export function isUndefined(data): boolean {
    return data == undefined || data == null;
} 