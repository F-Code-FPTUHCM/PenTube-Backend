import { join } from 'path';

export const geoIPConfig = {
    config: { file: join(process.cwd(), 'geoip2-cli', 'GeoLite2-City.mmdb') },
};
