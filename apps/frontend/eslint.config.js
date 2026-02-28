import { createFrontendConfig } from "@repo/eslint-config/frontend";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default createFrontendConfig({ tsconfigRootDir: __dirname });
