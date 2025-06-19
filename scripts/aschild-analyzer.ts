import fs from "fs";
import path from "path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import chalk from "chalk";

const projectRoot = process.cwd();

// Só arquivos .tsx agora
const isTSX = (file: string) => file.endsWith(".tsx");

function findAllFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) return findAllFiles(res);
    if (entry.isFile() && isTSX(res)) return [res];
    return [];
  });
}

function analyzeFile(filePath: string) {
  const code = fs.readFileSync(filePath, "utf8");

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
  } catch (error) {
    console.warn(chalk.yellow(`⚠️  Erro ao parsear ${filePath}: ${(error as Error).message}`));
    return;
  }

  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      if (!opening.attributes.some(attr =>
        attr.type === "JSXAttribute" &&
        attr.name.name === "asChild"
      )) return;

      const children = path.node.children.filter(
        child => child.type !== "JSXText" || child.value.trim() !== ""
      );

      if (children.length !== 1) {
        console.log(
          chalk.red(
            `❌ ${filePath}:${path.node.loc?.start.line}: <${(opening.name as any).name}> com 'asChild' tem ${children.length} filhos.`
          )
        );
      }
    },
  });
}

const allFiles = findAllFiles(projectRoot);
allFiles.forEach(analyzeFile);
