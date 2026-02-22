
type Action<T = any> = { type: string, payload: Partial<T> };

export type {
    Action,
};
