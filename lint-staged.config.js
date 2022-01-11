const { ESLint } = require('eslint')
const filterAsync = require('node-filter-async').default

const eslintCli = new ESLint()

const removeIgnoredFiles = async (files, eslintCli) => {
  const filteredFiles = await filterAsync(files, async file => {
    const isIgnored = await eslintCli.isPathIgnored(file)
    return !isIgnored
  })
  return filteredFiles.join(' ')
}

module.exports = {
  '{apps,packages}/**/*.ts?(x)': async files => {
    const filesToLint = await removeIgnoredFiles(files, eslintCli)
    if (!filesToLint) {
      return []
    }
    return [
      `yarn run eslint --max-warnings=0 --cache --debug ${filesToLint}`,
      `yarn run prettier --write ${filesToLint}`,
    ]
  },
  '{apps,packages}/**/*.js?(x)': async files => {
    const filesToLint = await removeIgnoredFiles(files, eslintCli)
    if (!filesToLint) {
      return []
    }
    return [
      `yarn run eslint --cache ${filesToLint}`,
      `yarn run prettier --write ${filesToLint}`,
    ]
  },
}
