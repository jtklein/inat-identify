# iNat-Toolcat
iNat-Toolcat is an open-source smartphone application for identifying large batches of iNaturalist observations. You can swipe through a stack of unidentified observations, and roughly sort them into higher taxa.

![Example1](docs/gifs/swiper.gif)

## 🗺 Project Layout

- [`assets`](/assets) All images, icons and aninations shown in the app.
- [`docs`](/docs) Documentation
- [`e2e`](/e2e) Source code for end-to-end testing.
- [`src`](/src) React-native source code for the app.

# 👏 Contributing
If you like iNat-Toolcat and want to help make it better then you are warmly welcome to contribute to this repository.

## Prerequisites
You need to have the expo-cli globally on your system.
```bash
npm install -g expo-cli
```

You need to have access tokens to an app that you created on iNaturalist and your JWT for quicker development. Paste them into the files created by this script in the secrets folder.
```bash
mkdir secrets
cp oauth_example.json ./secrets/oauth.json
cp api_token_example.json ./secrets/api_token.json
```

## Install packagess
1. Run
```bash
yarn install
```

## Run build
1. Run
```bash
yarn start
```
This will check if you have relevant keys, tokens, or otherwise required secrets in your repository.



# E2e testing
If Expo and the iOS Simulator aren’t still running, start them:

```bash
yarn ios
```

Then, in another terminal, run Detox:

```bash
detox test
```
