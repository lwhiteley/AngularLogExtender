# A Hacker's Guide to Log Ex Development

#### Dependencies
* [node.js](http://nodejs.org/)
* [phantomjs](http://phantomjs.org/)
* [grunt](http://gruntjs.com/)
* [git](http://git-scm.com/)

#### Setting up your environment

First thing you need to do install the dependencies above. After you have done that, believe it or not you have done 3/4 of the work needed to start hacking away.

Navigate to the project directory **personsal_git/AngularLogExtender** and execute the `npm install` command. This command will install all nodejs depdencies

#### Installing Grunt
Grunt is needed to create releases, concat, minify and  run tests (just to name a few)

Before you continue ensure that grunt is installed (as a hard dependecy on `node.js`)

```bash
npm install -g grunt-cli
```

#### Running tests

Use the following grunt command to run tests once : `grunt test`

#### Autorun tests

Use the following grunt command to autorun test : `grunt watch`

#### Creating Distrubuted Version

There are two types of releases that can be created using `grunt`.

1. a developer snapshot release `grunt dev-release`
2. a release snaphost `grunt release`

*NB: All files are checked for lint. Do not check-in files if linting fails.*

#### Pull Requests

All pull requests should have the `develop` branch as the destination

Ensure new functionality or refactors are tested properly

Essentially, a conversation needs to take place before code is pushed to `master`

This process reduces surprises and helps maintain quality

> NB : All new features are added or considered only in the form a pull request. If a pull request is not present your changes will not be accepteed into develop or master

#### Rebasing Feature Branches.

Git rebase is a very powerful feature in git that allows a developer to rewrite history; In our case it should be used to squash your commits into one properly written commit.

#### What makes a good commit ?

##### DO

1.  Write the summary line and description of what you have done in the imperative mode, that is as if you were commanding someone. Write "fix", "add", "change" instead of "fixed", "added", "changed".
1. Always leave the second line blank.
1. Line break the commit message (to make the commit message readable without having to scroll horizontally in gitk).

##### DON'T

1. Don't end the summary line with a period - it's a title and titles don't end with a period.

For more information on good commit message please [read](http://robots.thoughtbot.com/5-useful-tips-for-a-better-commit-message)

#### Closing an issue with Commit Message

To close an issue in the same repository, use one of the keywords in the list below followed by a reference to the issue number in the commit message. For example, a commit message with Fixes #45 will close issue 45 in that repository once the commit is merged into the default branch.

Keywords for closing issues

The following keywords will close an issue via commit message:

- close
- closes
- closed
- fix
- fixes
- fixed
- resolve
- resolves
- resolved

**NB: All pull request commit must end with the following syntax ..<message>. closes #<issue #> **

For more information please [read](https://help.github.com/articles/closing-issues-via-commit-messages)

#### Squashing Commits

Squash your commits into one cohesive, properly message commit.

the `git rebase -i` command is good for doing squashes

For more information on squashing please [read](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html).

Only one commit will be accepted per pull request! The purpose if this is to make it easier to generate changelogs using the `git log` command.

#### [HUB](https://hub.github.com/) Module

https://hub.github.com/ is a very good command line tool for working with git repositories, it can be used to generate pull request from the command line. Rule of thumb, an issue/request should be converted to a pull request so that it can be easily referenced.


Following command can be used to convert an issue **$ISSUE_NUMBER** into a pull request that is to be merged against **$BRANCH**

```bash
hub pull-request -i $ISSUE_NUMBER -b $BRANCH
```

The following code was extracted from my dotfiles and provides a easy bash script to create pull requests.

```bash
# the following is a an alias for hub.github.com pull-request function
function pull_req () {
    BRANCH=$2
    if [ -z "$1" ]; then
    echo 'You did not specify a issue # !'
        return;
  fi
    if [ -z "$2" ]; then
    BRANCH="develop"
  fi
    hub pull-request -i $1 -b $BRANCH
}

pull_req 11 # creates a pull request for issue #11 against the develop branch
```

#### Jasmine Testing

All tests are written using the Jasmine Framework version `1.3.1`.
Currently the application is tested with the following versions of angular : 

1. "1.0.4"
2.  "1.1.0"
3.  "1.2.25" (latests stable release)
4.  "1.3.0-rc.2" (latest development release)

NB: The `datespy` library is also provided for mocking dates

#### Reading & Reviewing

Ensure that you have an understanding of how stuff works inside AngularLogExtender.  Before any development starts please ensure you have knowledge on all the areas in the following lists

1. NodeJS
1. Grunt tasks
1. Semantic Versioning
1. [Jasmine Testing](http://jasmine.github.io/1.3/introduction.html)
1. [Karma configuration & Test Execution](http://karma-runner.github.io/0.12/index.html)
1. [AngularJS](https://docs.angularjs.org/guide)
1. [AngularJS providers](https://code.angularjs.org/1.2.25/docs/guide/providers)

Also take a look at the tests, mess with them, look at the classes and be able to make pragmatic decisions about your design.

#### Code Coverage

The current code coverage is 100%, anything less than that means TTD wasn't used or there is isn't enough test to cover your logic. With a test-first approach it's almost always guaranteed that the coverage will be 100%. After the execution of `grunt test`, the code coverage is stored inside the `coverage` folder. Open the index.html and review, this can aid you in determining which areas of your code wasn't properly tested.

#### Semantic Versioning Release Logic

And the implementation is as follows:

```bash
grunt bump:major        # bump major version, eg. 1.0.2 -> 2.0.0
grunt bump:minor        # bump minor version, eg. 0.1.3 -> 0.2.0
grunt bump:patch        # bump minor version, eg. 0.0.1 -> 0.0.2
```

### If the current version is already a prerelease version, this will work.
```bash
grunt bump:prerelease   # bump prerelease version, eg. 0.0.1-9 -> 0.0.1-10
```

### But if it isn't you'll run into an improperly bumped version.

```bash
grunt bump:prerelease   # bump prerelease version, eg. 1.0.2 -> 1.0.2-0
grunt bump:prerelease   # bump prerelease version, eg. 0.1.3 -> 0.1.3-0
grunt bump:prerelease   # bump prerelease version, eg. 0.0.1 -> 0.0.1-0
```

### Because prerelease has no idea if you're going from 0.0.1 to 0.0.2-0 or 0.1.0-0 or 1.0.0-0, you need to use it in conjunction with one of the other three semver increment modes. 

You can specify any number of :-separated modes.

```bash
grunt bump:major:prerelease   # eg. 1.0.2 -> 2.0.0-0
grunt bump:minor:prerelease   # eg. 0.1.3 -> 0.2.0-0
grunt bump:patch:prerelease   # eg. 0.0.1 -> 0.0.2-0
```

### You can also use abbreviations, as long as they aren't ambiguous

```bash
grunt bump:ma:pr   # still works, eg. 1.0.2 -> 2.0.0-0
grunt bump:mi:pr   # still works, eg. 0.1.3 -> 0.2.0-0
grunt bump:pa:pr   # still works, eg. 0.0.1 -> 0.0.2-0
```

### Support is also available for bump:git
 Git releases are developer snapshots and should not be used in production.

```bash
grunt bump:git   # still works, eg. 0.1.0 -> 0.1.0+sha.c8ba77d
grunt bump:pr:git   # still works, eg. 0.1.0-0 -> 0.1.0-0+sha.c8ba77d
```