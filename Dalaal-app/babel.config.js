module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      function () {
        return {
          visitor: {
            MetaProperty(path) {
              if (
                path.node.meta &&
                path.node.meta.name === 'import' &&
                path.node.property.name === 'meta'
              ) {
                const parent = path.parentPath;
                if (parent.isMemberExpression() && parent.node.property.name === 'env') {
                  parent.replaceWithSourceString('process.env');
                } else if (parent.isMemberExpression() && parent.node.property.name === 'url') {
                  parent.replaceWithSourceString('""');
                } else {
                  path.replaceWithSourceString('({})');
                }
              }
            }
          }
        };
      }
    ]
  };
};
