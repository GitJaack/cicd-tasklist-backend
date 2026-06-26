import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../../");
const testSchemaPath = path.join(projectRoot, "prisma", "schema-test.prisma");
const testDbPath = path.join(projectRoot, "prisma", "test.db");

execSync(`npx prisma generate --schema="${testSchemaPath}"`, {
  cwd: projectRoot,
  stdio: "pipe",
});

execSync(
  `npx prisma db push --schema="${testSchemaPath}" --force-reset --accept-data-loss`,
  {
    cwd: projectRoot,
    stdio: "pipe",
  }
);

const require = createRequire(import.meta.url);
const clientPath = path.join(
  projectRoot,
  "node_modules",
  ".prisma",
  "client-test"
);
const { PrismaClient } = require(clientPath) as {
  PrismaClient: new (opts?: unknown) => import("@prisma/client").PrismaClient;
};

const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${testDbPath}`,
    },
  },
});

export default testPrisma;