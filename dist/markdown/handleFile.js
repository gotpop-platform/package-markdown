import { join } from "path";
import { readFileSync } from "fs";
export const constructFilePath = (directoryPath, fileName) => {
    return join(directoryPath, `${fileName}.md`);
};
export const readFileContent = (filePath) => {
    if (!filePath) {
        throw new Error(`File not found: ${filePath}`);
    }
    return readFileSync(filePath, "utf-8");
};
