import path from "path";
import AdmZip from "adm-zip";
import packageJson from "./package.json" with { type: "json" };

const { version, name } = packageJson

//const date = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, 'Z');
const outputPath = path.resolve('packages', `${name}-${version}.zip`);
const zip = new AdmZip();
zip.addLocalFolder('dist');
zip.writeZip(outputPath);

console.log(`Package created: ${outputPath}`);
