# inat-toolkit
A smartphone application to identify large batches of iNaturalist observations.

![Example1](docs/gifs/swiper.gif)



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
