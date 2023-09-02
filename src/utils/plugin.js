// @ts-check

'use strict';

const { NormalModuleReplacementPlugin } = require('webpack');
// @ts-expect-error: no typings
const { createTildeImportExpander } = require('tilde-imports');
const { getMonorepoDirpath } = require('get-monorepo-root')

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
		const expandTildeImport = createTildeImportExpander({
			monorepoDirpath: getMonorepoDirpath(__dirname)
		});

		new NormalModuleReplacementPlugin(/^~/, (resource) => {
			if (this.skip?.(resource)) {
				return;
			}

			const expandedImport = expandTildeImport({
				importSpecifier: resource.request,
				importerFilepath: resource.context
			});
			resource.request = expandedImport;
		}).apply(compiler);
	}
};
