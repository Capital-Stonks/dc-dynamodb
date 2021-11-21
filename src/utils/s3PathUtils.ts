export const createPath = (...args) => args.join('/');

export const createS3Path = (
    folder: string,
    gameName: string,
    filename: string,
    parentFolder: string | null = null
) =>
    parentFolder
        ? createPath(folder, gameName, parentFolder, filename)
        : createPath(folder, gameName, filename);

export const updateS3PathFolder = (toFolder: string, s3Path): string => {
    const parts = s3Path.split('/');
    parts[0] = toFolder;
    return parts.join('/');
};

export const addParentFolder = (parentFolder: string, s3Path: string) => {
    const parts = s3Path.split('/');
    return createPath(parts[0], parts[1], parentFolder, parts[2]);
};
