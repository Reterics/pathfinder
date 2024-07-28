import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import packageJson from './package.json'

const gitCommit = spawnSync('git', ['rev-parse', '--short', 'HEAD'])
    .stdout.toString()
    .trim()

const changelog = fs.readFileSync('./CHANGELOG.md', 'utf-8')


export const defineViteConfig = {
    __VERSION__: JSON.stringify(packageJson.version),
    __NAME__: JSON.stringify(packageJson.name),
    __DISPLAY_NAME__: JSON.stringify(packageJson.displayName),
    __CHANGELOG__: JSON.stringify(changelog),
    __GIT_COMMIT__: JSON.stringify(gitCommit),
    __GITHUB_URL__: JSON.stringify(packageJson.repository.url),
}
