import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils'

import generatePackageJson from 'rollup-plugin-generate-package-json'

const { name, module } = getPackageJSON('react')
// react包的路径
const pkgPath = resolvePkgPath(name)
//react产物路径
const pkgDistPath = resolvePkgPath(name, true)

export default [
  // react 的包
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      format: 'umd', // 该格式能够兼容commonjs
    },
    plugins: [
      ...getBaseRollupPlugins(),
      // 生成package.json文件
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
  // jsx-runtime 和 jsx-dev-runtime 的包
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      // jsx-runtime
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime',
        format: 'umd',
      },
      // jsx-dev-runtime
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        format: 'umd',
      },
    ],
    plugins: getBaseRollupPlugins(),
  },
]
