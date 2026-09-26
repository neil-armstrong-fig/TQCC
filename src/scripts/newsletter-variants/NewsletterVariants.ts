import path from "node:path";

import sharp from "sharp";

import { IMAGE_VARIANT_WIDTHS } from "../../lib/image-size.ts";

const QUALITY = 68;

await generateVariants(process.argv.slice(2));

async function generateVariants(files: string[]): Promise<void> {
  if (files.length === 0) {
    throw new Error("Usage: npm run newsletter:variants -- public/images/uploads/<file>.webp [...]");
  }

  for (const file of files) {
    const { width = 0 } = await sharp(file).metadata();
    const { dir, name } = path.parse(file);

    for (const variantWidth of IMAGE_VARIANT_WIDTHS) {
      if (variantWidth >= width) continue;

      const output = path.join(dir, `${name}-${variantWidth}.webp`);
      const info = await sharp(file).resize({ width: variantWidth }).webp({ quality: QUALITY }).toFile(output);
      console.log(output, `${(info.size / 1024).toFixed(0)} KiB`);
    }
  }
}
