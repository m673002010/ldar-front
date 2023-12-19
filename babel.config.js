module.exports = {
	presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset', // 注释此行
		// ["@vue/app", {
		// 	"useBuiltIns": "entry",
		// 	"polyfills": [
		// 		"es6.promise",
		// 		"es6.symbol"
		// 	]
		// }],
		// ['@babel/preset-env', { targets: { node: 'current' } }]
  	],
  	'env': {
		'development': {
			// babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
			// This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
			// https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
			'plugins': ['dynamic-import-node']
		}
  	}
}
