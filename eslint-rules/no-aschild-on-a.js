
/**
 * @fileoverview Rule to disallow the 'asChild' prop on native 'a' elements.
 * @author PsiGuard AI Assistant
 */
"use strict";

module.exports = {
  meta: {
    type: "problem", // `problem` means this rule identifies code that is actually incorrect
    docs: {
      description: "Disallow the 'asChild' prop on native 'a' elements.",
      category: "Best Practices",
      recommended: true,
      url: "https://firebase.google.com/docs/studio" // Replace with actual doc URL if available
    },
    fixable: null, // No autofix is provided for this rule
    schema: [] // No options
  },
  create: function(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name && node.name.type === 'JSXIdentifier' && node.name.name === 'a') {
          const asChildProp = node.attributes.find(
            (attribute) =>
              attribute.type === 'JSXAttribute' &&
              attribute.name.name === 'asChild'
          );
          if (asChildProp) {
            context.report({
              node: asChildProp,
              message: "The 'asChild' prop should not be used directly on native 'a' elements. If this 'a' tag is a child of a component that uses 'asChild' (like <Button asChild> or <Link asChild>), ensure the parent component correctly consumes the 'asChild' pattern. Native 'a' tags do not understand 'asChild'."
            });
          }
        }
      }
    };
  }
};
