/**
 * Created by ferron on 12/22/13.
 */

var fs = require('fs');
var shell = require('shelljs');
var grunt = require('grunt');
var version;

module.exports = {

    getVersion: function(){
        if (version) return version;

        var pkg = JSON.parse(fs.readFileSync('package.json', 'UTF-8'));
        var match = pkg.version.match(/^([^\-]*)(?:\-(.+))?$/);
        var semver = match[1].split('.');

        var fullVersion = match[1];

        if (match[2]) {
            fullVersion += '-';
            fullVersion += (match[2] == 'snapshot') ? getSnapshotSuffix() : match[2];
        }

        version = {
            full: fullVersion,
            major: semver[0],
            minor: semver[1],
            dot: semver[2].replace(/rc\d+/, '')
        };

        return version;

        function getSnapshotSuffix() {
            var hash = shell.exec('git rev-parse --short HEAD', {silent: true}).output.replace('\n', '');
            return 'sha.'+hash;
        }
    }
};