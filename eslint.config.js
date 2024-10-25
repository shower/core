import globals from 'globals';
import js from '@eslint/js';

export default [
	js.configs.recommended,

	{
		ignores: ['lib/**/*.js'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},

	{
		files: ['lib/**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
];
