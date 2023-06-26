import fs from 'fs';

export async function toFile(manifest, path) {
  // Convert the manifest to json
  const json = JSON.stringify(manifest);
  // Write the manifest to a file
  return new Promise((resolve, reject) => {
    fs.writeFile(path, json, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
