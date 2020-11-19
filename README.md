# iNat-Toolcat
iNat-Toolcat is an open-source smartphone application for identifying large batches of iNaturalist observations. You can swipe through a stack of unidentified observations, and roughly sort them into higher taxa.

![Example1](docs/gifs/swiper.gif)

## 🗺 Project Layout

- [`assets`](/assets) All images, icons and aninations shown in the app.
- [`docs`](/docs) Documentation
- [`e2e`](/e2e) Source code for end-to-end testing.
- [`src`](/src) React-native source code for the app.

# E2e testing
If Expo and the iOS Simulator aren’t still running, start them:

```bash
$ yarn ios
```

Then, in another terminal, run Detox:

```bash
$ detox test
```

expo build:ios --type archive
expo build:android --type app-bundle
