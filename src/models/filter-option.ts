export interface FilterOption {
    key: number | string;
    value: string;
    children: FilterOptionChild[];
}

export interface FilterOptionChild {
    key: number | string;
    value: string;
    parent?: string;
}
