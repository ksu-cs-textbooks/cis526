---
title: "Git"
pre: "7. "
weight: 70
date: 2018-08-24T10:53:26-05:00
---

Most Node packages are made available as [git](https://git-scm.com) repositories, and npm has built-in support for using git.

## The Repository Property
In your _package.json_ file, you can specify a `"repository"` property, which specifies where the repository for this project exists.  Consider the following example of the npm command-line interface package:

```json
"repository": {
  "type" : "git",
  "url" : "https://github.com/npm/cli.git"
}
```

For many open-source projects, the repository is located on Github, a GitHub gist, BitBucket, or a Gitlab instance.  These can be specified with a shorthand, which matches the corresponding `npm install` argument:

```json
"repository": "npm/npm"

"repository": "github:user/repo"

"repository": "gist:11081aaa281"

"repository": "bitbucket:user/repo"

"repository": "gitlab:user/repo"
```

If your project folder already is set up as a git repo _before_ you run `$npm init`, then the wizard will suggest using the existing repository.

## The .gitignore File 
Like any git repo, there are some files you will want to exclude from  version control.  The most important of these is the _node_modules_ folder, which we exclude for two reasons:

1. The folder's contents are large, and are available from the original sources specified in your package's dependencies - therefore they represent significant and unnecessary glut in a repository.
2. Some portions of your dependencies may be compiled from C code as they are installed.  Since C code is compiled into binaries for a specific target machine's architecture, you will encounter errors if your development and production machines are different.  Re-installing packages in the production machine with `$npm install` avoids this.

Therefore, you should include _at least_ this line in your _.gitignore_ file:
```text 
node_modules/
```

It's also a good idea to leave out any logging files:

```text 
logs
*.log
```

You may also want to look at Github's boilerplate [Node .gitigore template](https://github.com/github/gitignore/blob/master/Node.gitignore), which adds additional rules based on many popular Node frameworks (adding an ignore for a file or directory that doesn't exist in your project is harmless).

The _.gitignore_ file should ideally be added before the repository has been created, as files already under version control override _.gitignore_ rules.

## Initializing the Repository
Now we can initialize our repository with the `$git init` command in the terminal:

```text
$ git init 
```

Note how a _.git_ directory is added to our project?  This is where git stores the __diff__ information that allows it to track versions of our code.

The `init` command adds the current directory structure (less that specified in the _.gitignore_ file) to the staging list.  Otherwise, we'd need to stage these files ourselves for version tracking with the git command, `add .`:

```text
$git add .
```

Once staged, we can commit the inital version of our package with a git `commit` command:

```text
$ git commit -a -m "Inital commit"
```

The `-a` flag indicates we are committing _all currently staged files_, alternatively you can commit files one-at-a-time, if you only want to commit one or a few files.  The `-m` file indicates we are also adding a commit message, which follows in quotes ("").  If we don't use this flag, then git will open a text editor to write the commit message in.  For the Linux platform, the default is _vi_, a powerful command line text editor that has a bit of a learning curve.  If you find vi has launched on you and you are uncertain how to proceed, follow these steps:

1. Type your commit message 
2. Hit the [ESC] key - this moves you from _edit_ mode to _command mode_
3. Type the command `:wq`.  Vi commands always start with a colon (:), and can be grouped.  The `w` indicates the file should be written (saved), and the `q` indicates we want to quit the editor.

## Adding Remote Repositories
If you want to host your repository on GitHub or another hosting tool (such as BitBucket or GitLab), you will need to add that repository's url as a _remote origin_ for your local repository.  You can do so with the command:

```text
$ git remote add origin [repo url]
```

Where `[repo url]` is the url of the remote repo.  If you want to use GitHub, create an empty repository, and copy the created repository's link.

If you clone a repository from GitHub or another tool, the remote origin is automatically set to that parent repository.  If you ever need to change the remote origin, it's a two-step process:

1. Delete the current origin with the git command:`$git remote rm origin`
2. Add your new origin with the git command: `$git remote add origin`

You can also add other targets than _origin_ (origin is a generic target meaning the originating repository).  To see all remote repositories, use the command `$git remote -v`, which lists all registered remote repositories (the `-v` flag is for _verbose_).

## Pushing and Pulling
The `$git push` and `$git pull` commands are shorthand for pushing and pulling the master branch to and from the origin repository. The full commands can be used to push an alternate branch or to reach an alternate remote repository:  `$git push [remote repo name] [branch name]`, `$git pull [remote repo name] [branch name]`

## Git and Codio 
Pushing your code to a remote repository is a good way to move it between Codio boxes.  You can clone such a repository after you create it with the command: 

```text
$ git clone [git clone url]
```

Where the `[git clone url]` is the URL of your remote repository.  Cloning a repository automatically sets its remote origin repo to the repository it was cloned from.