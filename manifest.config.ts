
import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json' assert { type: 'json' }

const { version, name, description, displayName } = packageJson
// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
    // can only contain digits, dots, or dash
    .replace(/[^\d.-]+/g, '')
    // split into version parts
    .split(/[.-]/)

export default defineManifest(async (env) => ({
    name: env.mode === 'staging' ? `[INTERNAL] ${name}` : displayName || name,
    description,
    version: `${major}.${minor}.${patch}.${label}`,
    version_name: version,
    manifest_version: 3,
    action: {
        default_popup: 'index.html',
    },
    background: {
        service_worker: 'src/background/index.ts',
        type: 'module',
    },
    content_scripts: [
        {
            all_frames: false,
            js: ['src/content-script/index.ts'],
            matches: ['*://*/*'],
            run_at: 'document_end',
        }
    ],
    offline_enabled: false,
    host_permissions: [],
    permissions: ['storage', 'tabs', 'background', "scripting", "activeTab"],
    web_accessible_resources: [
        {
            matches: ['*://*/*'],
            resources: ['src/content-script/index.ts'],
        },
        {
            matches: ['*://*/*'],
            resources: ['src/content-script/connector.js'],
        }
    ],
    icons: {
        16:  'src/assets/logo_white_16.png',
        32:  'src/assets/logo_white_32.png',
        48:  'src/assets/logo_white_48.png',
        128: 'src/assets/logo_white_128.png'
    },
}))
