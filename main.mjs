import fs from "fs/promises"; // use promises instead of callbacks
import path from "path";

const numOfLicenses = {};

const countLicense = async (folder) => {
  const files = await fs.readdir(folder);

  for (let file of files) {
    const filePath = path.join(folder, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await countLicense(filePath); // if the file is a directory call the function recursively
    } else if (file === "package.json") {
      const packageJson = JSON.parse(await fs.readFile(filePath, "utf-8"));
      let license = packageJson.license;

      // numOfLicenses[license] += 1;
      // If we dont check for 0 (or any falsy value) the result would be NaN
      numOfLicenses[license] = (numOfLicenses[license] || 0) + 1;
    }
  }
};

const checkFolder = "node_modules";

async function licenseCount(checkFolder) {
  await countLicense(checkFolder);

  fs.writeFile("licenses.json", JSON.stringify(numOfLicenses, null, 2));
  console.log(
    "All licenses have been counted, make sure you wont get sued 💼🪪"
  );
  for (const [license, count] of Object.entries(numOfLicenses)) {
    console.log(`Number of ${license} in the file is ${count}`);
  }
}

licenseCount(checkFolder);
