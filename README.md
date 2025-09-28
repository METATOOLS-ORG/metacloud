<img width="600" alt="metacloud-banner-v5" src="https://github.com/user-attachments/assets/d0096650-5636-4eb2-8086-79c6932fe288" />


# metacloud
a more open alternative to soundcloud?

metacloud is a work in progress experimental music and wip sharing site, written in sveltekit and prisma

**this is not production ready yet, don't actually use this**

<img width="800" alt="metacloud screenshot" src="https://github.com/user-attachments/assets/9cff31fe-be74-4553-a256-a8458fa0f22e" />


## code structure
- /.env - server and client config (copy from .env.example)
- /src/routes - all the pages in sveltekit structure
- /src/routes/api - the code for the api routes
- /src/components - the svelte components
- /src/lib - various common code
- /src/lib/server - some server side code like s3
- /static - static public assets
  
## what you need
- node.js - https://nodejs.org/
- git - https://git-scm.com/downloads
- audiowaveform binary in path - https://github.com/bbc/audiowaveform
- ffprobe binary in path
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

ctrl+click the localhost link in the console to open metacloud!

keep in mind this server is running in development mode and is not production ready, do not host it publicly, i would tell you how to enable production mode but there is no production mode yet

note: on macOS if you get an error about xcodebuild, run `sudo xcode-select -switch /Applications/Xcode.app/Contents/Developer` in a terminal


## updating database
run the following command after changing database schemes to apply the changes

if asked to name the migration, type in what you changed (like "added assets field to user"), please commit the migration as well

```
pnpm run migrate
```

after that, restart your code editor or lsp server to make sure it's using the newly generated prisma client package

## license
there is no license yet but there will be soon, keep in mind if you contribute at the moment you accept your code being relicensed later on once a license has been chosen
