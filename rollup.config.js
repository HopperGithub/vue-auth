import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/main.js',
    format: 'cjs',
    dest: 'index.js',
    // format: 'esm',
    // dest: 'dist/index.esm.js',
    plugins: [
        babel({
          exclude: 'node_modules/**'
        })
    ]
}