// @ts-check

'use strict';

const { NormalModuleReplacementPlugin } = require('webpack');
const { expandTildeImport } = require('tilde-imports');

module.exports = class TildeImportsPlugin {
	/** @type {((resource: any) => boolean) | undefined} */
	skip;

	/**
		@param {{ skip?: (resource: any) => boolean }} [options]
	*/
	constructor(options) {
		this.skip = options?.skip;
	}

	/**
		@param {import('webpack').Compiler} compiler
	*/
	apply(compiler) {
		new NormalModuleReplacementPlugin(/^~/, (resource) => {
			if (this.skip?.(resource)) {
				return;
			}

			const expandedImport = expandTildeImport({
				importSpecifier: resource.request,
				importerFilePath: resource.context
			});
			resource.request = expandedImport;
		}).apply(compiler);
	}
};
