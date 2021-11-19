import { SK_SEPARATOR } from '../../constants';
import momentTz from 'moment-timezone'
const moment = momentTz;

export const preMarshallPrep = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
}

export const getSk = (gameName, guid) => `${gameName}${SK_SEPARATOR}${guid}`

export const dateEst = () => moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS')
