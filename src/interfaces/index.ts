export enum EnvName {
    DEV = 'development',
    LOCAL = 'local',
    PRODUCTION = 'production',
}

export interface IDynamoConfig {
    envName: EnvName,
    region: string;
}

export interface IGetClips {
    gameName: string,
    rating?: number,
    guid?: string,
}

export interface IPutClip {
    gameName: string;
    guid: string;
    username?: string;
    source?: string;
    sourceTitle?: string;
    sourceDescription: string
    rating?: string;
    ratedAtDate?: string;
    usedInVideoAtDate?: string;
    aggregatedAtDate?: string;
    tags?: string[];
    duration?: number;
    resolutionHeight?: number;
}
