import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

// Get .env from yaml file
export const configYAML = () => {
    const YAML_CONFIG_URI = 'config.dev.yaml';
    return yaml.load(readFileSync(join(__dirname, YAML_CONFIG_URI), 'utf8')) as Record<string, any>;
};

export default configYAML;
