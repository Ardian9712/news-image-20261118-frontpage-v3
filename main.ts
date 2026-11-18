import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const maximumBytes = 1024 * 1024;
const maximumDimension = 1024;
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(scriptDirectory, "entry.png");
const outputDirectory = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
const outputPath = resolve(outputDirectory, "entry.png");

type ImageDimensions = { width: number; height: number };

function readJpegDimensions(bytes: Uint8Array): ImageDimensions {
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      throw new Error("Invalid JPEG segment boundary.");
    }
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) break;

    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;

    if (offset + 2 > bytes.length) {
      throw new Error("Truncated JPEG segment length.");
    }
    const segmentLength = (bytes[offset] << 8) | bytes[offset + 1];
    if (segmentLength < 2 || offset + segmentLength > bytes.length) {
      throw new Error("Invalid JPEG segment length.");
    }

    // Start-of-frame markers contain dimensions; table markers do not.
    const isFrame = marker >= 0xc0 && marker <= 0xcf
      && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) {
      if (segmentLength < 8) throw new Error("Truncated JPEG frame header.");
      return {
        width: (bytes[offset + 5] << 8) | bytes[offset + 6],
        height: (bytes[offset + 3] << 8) | bytes[offset + 4],
      };
    }
    offset += segmentLength;
  }
  throw new Error("JPEG frame dimensions were not found.");
}

function validateImage(bytes: Uint8Array, label: string): ImageDimensions {
  if (bytes.byteLength === 0 || bytes.byteLength >= maximumBytes) {
    throw new Error(`${label} must be nonempty and smaller than 1 MiB.`);
  }
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error(`${label} must contain JPEG data.`);
  }
  const dimensions = readJpegDimensions(bytes);
  if (dimensions.width < 1 || dimensions.height < 1
      || dimensions.width > maximumDimension || dimensions.height > maximumDimension) {
    throw new Error(`${label} dimensions must be between 1x1 and 1024x1024.`);
  }
  return dimensions;
}

const sourceBytes = await readFile(sourcePath);
validateImage(sourceBytes, "Source image");

await mkdir(outputDirectory, { recursive: true });
await copyFile(sourcePath, outputPath);

const outputBytes = await readFile(outputPath);
if (outputBytes.length !== sourceBytes.length || !outputBytes.equals(sourceBytes)) {
  throw new Error("The output image differs from the source image.");
}
const dimensions = validateImage(outputBytes, "Output image");

console.log(
  `${outputPath} — ${outputBytes.length} bytes; JPEG ${dimensions.width}x${dimensions.height}; byte-identical copy`,
);
