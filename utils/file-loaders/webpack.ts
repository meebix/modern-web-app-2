const FILES: any = {
  typeDefs: require.context('../../client/models', true, /types\/.*.graphql$/),
  resolvers: require.context('../../client/models', true, /resolvers\/.*.ts$/),
};

/**
 * Load contexts of given files
 *
 * @param type - The type of file to be loaded
 * @returns An array of file contents from each file
 */
export const fileLoader = (type: string): any => {
  const array: any = [];
  const files = FILES[type];

  files.keys().forEach(file => {
    const ext = file.split('.').pop();
    const data = files(file);

    switch (ext) {
      case 'ts': {
        array.push(data.default);
        break;
      }
      case 'graphql':
        array.push(data.loc.source.body);
        break;
      default:
        break;
    }
  });

  return array;
};
