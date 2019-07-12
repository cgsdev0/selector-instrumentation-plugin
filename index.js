module.exports = ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.callee.type !== "Identifier") return;
        if (path.node.callee.name !== "createSelector") return;
        if (path.parent.type !== "VariableDeclarator") return;
        const wrapperName = state.opts.wrapperName || "makeCreateSelector";
        const selectorName = path.parent.id.name;
        const selectorArgs = path.node.arguments;
        const newCall = t.callExpression(
          t.callExpression(t.identifier(wrapperName), [
            t.stringLiteral(selectorName),
          ]),
          selectorArgs,
        );

        path.replaceWith(newCall);
      },
      ImportDeclaration(path, state) {
        if (path.node.source.type !== "StringLiteral") return;
        if (path.node.source.value !== "reselect") return;
        const specifier = path.node.specifiers.find(specifier => specifier.type === "ImportSpecifier" && specifier.imported.name === "createSelector" && specifier.local.name === "createSelector");
        if(!specifier) return;
        path.node.specifiers = path.node.specifiers.filter(s => s != specifier);
        const wrapperName = state.opts.wrapperName || "makeCreateSelector";
        const importPath = state.opts.importPath || "make-create-selector";
        const newImport = t.importDeclaration([t.importSpecifier(t.identifier(wrapperName), t.identifier(wrapperName))], t.stringLiteral(importPath));
        path.insertAfter(newImport);
        if (path.node.specifiers.length === 0) {
          path.remove();
        }
      },
    },
  };
};
