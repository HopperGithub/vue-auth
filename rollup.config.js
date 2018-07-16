import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/main.js',
    format: 'cjs',
    // format: 'esm',
    // dest: 'dist/vue4auth.esm.js',
    dest: 'dist/vue4auth.js',
    plugins: [
        babel({
          exclude: 'node_modules/**'
        })
    ]
}