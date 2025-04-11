# otp_client

This is a client written in Electron to be used with a Nextcloud instance and the plugin [OTP-Manager](https://apps.nextcloud.com/apps/otpmanager).

## usage

You need to have [npm](https://docs.npmjs.com/) installed on your system. All dependencies can be loaded automatically using the command

`npm install`

Once all dependencies are loaded, start the app using the command

`npm start`

Building a new version as Windows executable or Debian package, use

`npm run make`

Maybe you need to install `flatpak-builder` so that the flatpak-file can be built.
For building the Windows executable on a linux machine, mono and wine must be installed.

## version history

### 1.0.7
- transparent background for icon
- close to systray

### 1.0.6
- hide electron window menu

### 1.0.5

- improvements with individual counters based on the accounts period.
- copy current otp code to clipboard
- full offline capability: if there is no internet, uses the last known accounts
- added builders for flatpak, macos, windows, zip, although macos, windows and zip do not yet work.
- ship packages to dist-folder

### 1.0.4

- using electron to build deb package for linux

### 1.0.3

- as standalone HTML5 web app

### 1.0.1 - 1.0.2

- improved ui with bootstrap.

### 1.0.0

- Basic client that allows login with username / password and setting the password of the OTP-Manager.
- Credentials are stored in the localStorage-Object.
- Client is capable of loading existing configurations from Nextcloud and generate the OTP-codes.
