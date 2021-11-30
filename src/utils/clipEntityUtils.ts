import { IClip } from '../interfaces';
import { v4 } from 'uuid';
import { createS3Path } from './s3PathUtils';
import { dateEst } from './dateUtils';
import { getSk, preMarshallPrep } from './dynamoUtils';

interface IClipPartial {
    username?: string;
    source?: string;
    sourceTitle?: string;
    sourceDescription?: string;
    rating?: number;
    ratedAtDate?: string;
    usedInVideoAtDate?: string;
    usedInShortAtDate?: string;
    aggregatedAtDate?: string;
    tags?: string[];
    duration?: number;
    resolutionHeight?: number;
    thumbnailS3Path?: string;
    updatedAt?: string;
}

export const createClipEntity = (
    gameName: string,
    folder: string,
    columns: IClipPartial,
    fileExtension = 'mp4'
): IClip => {
    const guid = v4();
    return {
        guid,
        gameName,
        createdAt: dateEst(),
        s3Path: createS3Path(folder, gameName, `${guid}.${fileExtension}`),
        ...columns,
    };
};

interface IOptions {
    isAddCreatedAt?: boolean;
    isAddUpdatedAt?: boolean;
}

export const preMarshallClip = (clip: IClip, options: IOptions) => {
    const gameName = clip.gameName || clip.pk;
    return preMarshallPrep({
        pk: gameName,
        sk: getSk(gameName, clip.guid),
        ...(options.isAddCreatedAt && { createdAt: dateEst() }),
        ...(options.isAddUpdatedAt && { updatedAt: dateEst() }),
        ...clip,
    });
};
