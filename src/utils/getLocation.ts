import * as geoIp from 'geoip-lite';

export type GetLocation = (ip: string) => Promise<Record<string, any>>;

// get location by ip from client
export const getLocation: GetLocation = async (ip: string) => {
    return geoIp.lookup(ip);
};
