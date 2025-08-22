# metacloud
WELCOME TO THE METACLOUD

metacloud is a work in progress experimental music and wip sharing site, written in sveltekit and prisma

a more open alternative to soundcloud?

**this is not production ready yet, don't actually use this**

## what you need
- node.js - https://nodejs.org/
- git - https://git-scm.com/downloads
- a key to something s3 compatible (more info in .env.example)

## installing and running
open a terminal window and run
```
git clone http://github.com/METATOOLS-ORG/metacloud.git
cd metacloud
npm i -g pnpm
pnpm install
pnpm run initdb
```

now, you need to set up the server and website config!
1. rename .env.example to .env
2. open it and fill out all the required keys

now that you've set up the config you can start metacloud at any time by doing
```
pnpm run dev
```

now you can ctrl+click the localhost link in the console to open metacloud!

keep in mind this server is running in development mode and is not production ready, do not host it publicly, i would tell you how to enable production mode but there is no production mode yet

note: on macOS if you get an error about xcodebuild, run `sudo xcode-select -switch /Applications/Xcode.app/Contents/Developer` in a terminal


# updating database
run the following command after changing database schemes to apply the changes

if asked to name the migration, type in what you changed (like "added assets field to user"), please commit the migration as well

```
pnpm run migrate
```

# code structure

todo
