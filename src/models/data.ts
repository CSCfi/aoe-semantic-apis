export interface KeyValue<K, V> {
    key: K;
    value: V;
}

export interface EducationLevel {
    key: string;
    value: string;
    children: Children[];
}

export interface Children {
    key: string;
    value: string;
}

export interface License {
    key: string;
    value: string;
    link: string;
    description: string;
}

export interface Accessibility {
    key: string;
    value: string;
    description: string;
    order: number;
}
