# Node and @aws-sdk versions

## Configuration

Create and edit _config/dev.yml_ to suit your needs.

Run `nvm use` to load the right node version and `npm install` to install all the dependencies.

## Deploy
Development: `AWS_PROFILE=xxx npx sls deploy`

## Get the Versions
`AWS_PROFILE=xxx npx sls invoke -f Node18`

`AWS_PROFILE=xxx npx sls invoke -f Node20`