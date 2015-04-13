var fs = require('fs');

module.exports = {
	getVersion: function () {
		var pkg = JSON.parse(fs.readFileSync('package.json', 'UTF-8'));
		return {
			version: pkg.version,
			website: pkg.website,
			license: pkg.license.type,
			contributor: pkg.author,
			appname: pkg.appname,
			description: pkg.description,
			supported_versions: pkg.supported_versions
		};
	}
};
