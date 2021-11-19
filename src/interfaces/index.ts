export enum EnvName {
    DEV = 'development',
    LOCAL = 'local',
    PRODUCTION = 'production',
}

export interface IDynamoConfig {
    envName: EnvName,
    region: string;
}

export interface IGetClip {
    gameName: string,
    guid: string,
}

export interface IPutClip {
    gameName: string;
    guid: string;
    s3Path: string;
    username?: string | undefined;
    source?: string | undefined;
    sourceTitle?: string | undefined;
    sourceDescription?: string | undefined;
    rating?: string | undefined;
    ratedAtDate?: string | undefined;
    usedInVideoAtDate?: string | undefined;
    usedInShortAtDate?: string | undefined;
    aggregatedAtDate?: string | undefined;
    tags?: string[] | undefined;
    duration?: number | undefined;
    resolutionHeight?: number | undefined;
}

export interface ICustomDateFilter{
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
