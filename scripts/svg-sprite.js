const SVGSpriter = require("svg-sprite");
const path = require("path");
const fs = require("fs");
const opts = require("minimist")(process.argv.slice(2));
const config = {
  mode: {
    symbol: {
      dest: opts.outDir,
      sprite: opts.outFile,
    },
  },
};
const spriter = new SVGSpriter(config);
const mapping = require("../mapping.json");

const mappingEntries = Object.entries(mapping);

const findNames = (symbol) => {
  return mappingEntries.filter(([_, s]) => s === symbol).map(([name]) => name);
};

const dirs = ["mocha", "macchiato", "frappe", "latte"];

mappingEntries.forEach(([mappedName, symbol]) => {
  const file = path.resolve(`./icons/${dirs.entries()}/${mappedName}.svg`);

  if (fs.existsSync(file)) {
    for (const name of findNames(symbol)) {
      spriter.add(
        path.resolve(`./icons/${name}.svg`),
        name + ".svg",
        fs.readFileSync(file, "utf-8"),
      );
    }
  }
});

spriter.compile(function (error, result, data) {
  fs.mkdirSync(path.resolve(opts.outDir), { recursive: true });
  fs.writeFileSync(result.symbol.sprite.path, result.symbol.sprite.contents);
});
