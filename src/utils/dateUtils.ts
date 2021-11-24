import moment from 'moment-timezone';

export const dateEst = () =>
    moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS');
