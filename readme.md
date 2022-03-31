# Bitovi Module Federation Generator

Bitovi Module Federation Generator saves you time by automatically creating and configuring module federation applications.
This package can not be installed as an npm package... yet

## How to use

Install Angular CLI

```
npm install -g @angular/cli
```

Clone the repo, enter the project and build

```
npm run build
```

Link to the package

```
npm link <package-path>
```

Now you can run the command wherever you want. Try it, for example, on your desktop.

## Commands

### Create new workspace

Basic usage

```
bi init
```

Complete usage

```
bi init --projectName=<project-name> --style=<style-language>
```

### Add new remote app

Basic usage

```
bi --remote=<remote-name>
```

Complete usage

```
bi init --remote=<project-name> --style=<style-language>
```

This command creates a new Angular app with it’s own webpack.config.js. This new remote application has a remote module that is exposed and imported into the main application as a new route.

### Add remote module to app

Basic usage

```
bi --addRemoteModule=<module-name>
```

Complete usage

```
bi --addRemoteModule=<module-name> --projectName=<existing-project-name>
```

This command creates a new module and exposes it to be able to request it from host app. It is also added to a new route in the `app-routing.module` of your remote app.

### Serve apps

Serve one app

```
bi --serve=<app-name>
```

Serve all apps

```
bi serveAll
```

You are still able to run ng serve inside the projects. But you need to be aware of the right ports. Bitovi does that for you.

### Build apps

Build one app

```
bi --build=<app-name>
```

Build all apps

```
bi buildAll
```

## New app example

```
# create new project
bi init --projectName=newProject --style=scss

# enter our project
cd newProject

# add remote
bi --remote=firstRemote --style=scss

# serve apps
bi serveAll
```
