# otp_client

This is a client written in Electron to be used with a Nextcloud instance and the plugin [OTP-Manager](https://apps.nextcloud.com/apps/otpmanager).

## usage

You need to have [npm](https://docs.npmjs.com/) installed on your system. All dependencies can be loaded automatically using the command

`npm install`

Once all dependencies are loaded, start the app using the command

`npm start`

## version history

### 1.0.4

using electron to build deb package for linux

### 1.0.3

as standalone HTML5 web app

### 1.0.1 - 1.0.2

improved ui with bootstrap.

### 1.0.0

Basic client that allows login with username / password and setting the password of the OTP-Manager.
Credentials are stored in the localStorage-Object.

Client is capable of loading existing configurations from Nextcloud and generate the OTP-codes.
