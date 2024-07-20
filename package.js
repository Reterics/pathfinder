import path from "path";
import AdmZip from "adm-zip";
import packageJson from "./package.json" with { type: "json" };
import * as fs from "node:fs";

const { version, name } = packageJson

//const date = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, 'Z');

// eslint-disable-next-line no-undef
const type = process.argv[2] || 'dist';
if (!fs.existsSync(type)) {
    console.error(type + ' has not found');
    // eslint-disable-next-line no-undef
    process.exit(1);
}
const outputPath = path.resolve('packages', `${name}-${version}-${type}.zip`);
const zip = new AdmZip();
zip.addLocalFolder(type);
zip.writeZip(outputPath);

console.log(`Package created: ${outputPath}`);
