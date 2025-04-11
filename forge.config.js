const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: 'src/pix/icon-512.png',
        maintainer: 'Robert Schrenk',
        homepage: 'https://www.github.com/rschrenk/otp-client'
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        background: "/src/pix/icon-512.png",
        format: "ULFO"
      }
    },
    {
      name: '@electron-forge/maker-flatpak',
      config: { }
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "otp_client"
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    }
  ],
  packagerConfig: {
    asar: true,
    executableName: "otp_client",
    icon: '/src/pix/icon-512',
    name: 'OTP Client',
    appCategoryType: 'public.app-category.utilities',
    ignore: ["dist"]
  },
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        generateReleaseNotes: true,
        repository: {
          owner: 'rschrenk',
          name: 'otp_client'
        }
      }
    }
  ],
  rebuildConfig: {}
};
