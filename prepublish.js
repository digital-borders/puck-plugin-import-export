import { execSync } from "child_process";

const RELEASE_MODE = !!process.env.RELEASE_MODE;

if (!RELEASE_MODE) {
  console.log(
    "YOU MUST NOT RUN THIS COMMAND! USE `npm run release` TO PUBLISH A NEW VERSION",
  );
  process.exit(1); //which terminates the publish process
}
console.log("PUBLISHING IN RELEASE MODE");
// Check also that node is on version 22.18.0 using cli
const nodeVersion = execSync("node --version").toString();

if (!nodeVersion.includes("v22.18.0")) {
  console.log(
    "YOU MUST USE NODE VERSION 22.18.0 TO BUILD THE PACKAGE AND PUBLISH NEW VERSION",
  );
  process.exit(1);
}
