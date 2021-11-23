import { IClip } from '../interfaces';
import { v4 } from 'uuid';
import { createS3Path } from './s3PathUtils';

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
        s3Path: createS3Path(folder, gameName, `${guid}.${fileExtension}`),
        ...columns,
    };
};
