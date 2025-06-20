module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "Ensure components using 'asChild' have a single React element child",
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    function hasAsChildAttr(node) {
      return (
        node.openingElement.attributes || []
      ).some(
        (attr) =>
          attr.type === 'JSXAttribute' &&
          attr.name &&
          attr.name.name === 'asChild'
      );
    }

    return {
      JSXElement(node) {
        if (!hasAsChildAttr(node)) return;

        const children = node.children.filter((child) => {
          return !(child.type === 'JSXText' && child.value.trim() === '');
        });

        if (children.length !== 1) {
          context.report({
            node,
            message:
              "Element with 'asChild' must have exactly one child element",
          });
          return;
        }

        const [child] = children;

        if (child.type !== 'JSXElement') {
          context.report({
            node: child,
            message:
              "Element with 'asChild' must contain a single JSX element child",
          });
          return;
        }

        if (
          child.openingElement.name.type === 'JSXIdentifier' &&
          child.openingElement.name.name === 'Fragment'
        ) {
          context.report({
            node: child,
            message:
              "Fragment children are not allowed when using 'asChild'",
          });
        }
      },
    };
  },
};
