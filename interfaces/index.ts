enum EnvName {
    DEV= 'development',
    LOCAL = 'local',
    PRODUCTION = 'production',
}

export interface IDynamoConfig {
    envName: EnvName,
    endpoint?: string;
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
    aggregatedAtDate?: string;
    username?: string;
    source: string;
    rating?: string;
    tags?: string[];
    s3Key: string;
    duration?: number;
    resolutionHeight?: number;
}
