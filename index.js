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
        console.log("step 0");
          console.log(path.node)
        if (path.node.source.type !== "StringLiteral") return;
        console.log("step 1");
        if (path.node.source.value !== "reselect") return;
        console.log("step 2");
        const specifier = path.node.specifiers.find(specifier => specifier.type === "ImportSpecifier")
        if(!specifier) return;
        const wrapperName = state.opts.wrapperName || "makeSelectorCreator";
        specifier.imported.name = wrapperName;
          specifier.local.name = wrapperName;
        const importPath = state.opts.importPath || "make-create-selector";
        path.node.source.value = importPath;
      },
    },
  };
};
