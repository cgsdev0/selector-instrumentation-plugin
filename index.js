module.exports = ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.callee.type !== "Identifier") return;
        if (path.node.callee.name !== "createSelector") return;
        if (path.parent.type !== "VariableDeclarator") return;
        const wrapperName = state.opts.wrapperName || "makeSelectorCreator";
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
    },
  };
};
