import { AWS_REGION } from '../constants';
import { EnvName } from '../interfaces';
import { ClipsRepository } from '../repositories/clipsRepository';

const clipRepo = new ClipsRepository({
    region: AWS_REGION,
    envName: EnvName.DEV,
});
