export enum EnvName {
    DEV = 'development',
    LOCAL = 'local',
    PRODUCTION = 'production',
}

export interface IDynamoConfig {
    envName: EnvName;
    region: string;
}

export interface IGetClip {
    gameName: string;
    guid: string;
}

export interface IClip {
    pk?: string;
    sk?: string;
    gameName?: string;
    guid: string;
    s3Path: string;
    createdAt: string;
    thumbnailS3Path?: string;
    updatedAt?: string;
    username?: string;
    source?: string;
    sourceTitle?: string;
    videoUrl?: string;
    videoLength?: string;
    sourceDescription?: string;
    rating?: number;
    ratedAtDate?: string;
    usedInVideoAtDate?: string;
    usedInShortAtDate?: string;
    aggregatedAtDate?: string;
    tags?: string[];
    duration?: number;
    resolutionHeight?: number;
}

export interface ICustomDateFilter {
    ratedAtDate?: string;
    usedInVideoAtDate?: string;
    usedInShortAtDate?: string;
    aggregatedAtDate?: string;
}

export interface IColumnNameMap {
    Name: string;
    Key: string;
    Value: string;
}

export interface IPutTags {
    pk: string;
    tags: object;
}
export interface IGetTags {
    gameName: string;
    sk: string;
}
