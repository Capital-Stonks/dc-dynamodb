import { IClip } from '../interfaces';
import { ClipsRepository } from '../repositories/clipsRepository';
import * as s3Util from './s3Utils';
import * as s3PathUtils from './s3PathUtils';

const clipRepo = new ClipsRepository();

export const createClip = async (
    clip: IClip,
    filePath: string
): Promise<IClip> => {
    await clipRepo.create(clip);
    return s3Util.putObjectFromFile(clip.s3Path, filePath).then(() => clip);
};

export const updateClip = async (
    clip: IClip,
    filePath: string,
    oldS3Path: string
): Promise<IClip> => {
    await clipRepo.put(clip);
    await s3Util.putObjectFromFile(clip.s3Path, filePath);
    return s3Util.deleteObject(oldS3Path).then(() => clip);
};

export const moveClip = async (
    clip: IClip,
    toFolder: string,
    parentFolder: string | null = null
): Promise<IClip> => {
    let newS3Path = s3PathUtils.updateS3PathFolder(toFolder, clip.s3Path);
    if (parentFolder) {
        newS3Path = s3PathUtils.addParentFolder(parentFolder, newS3Path);
    }
    const newClip = {
        ...clip,
        s3Path: newS3Path,
    };
    await clipRepo.put(newClip);
    return s3Util.moveObject(clip.s3Path, newS3Path).then(() => newClip);
};

export const deleteClip = async (clip: IClip) => {
    clipRepo.delete(clip.gameName, clip.guid);
    return s3Util.deleteObject(clip.s3Path);
};
