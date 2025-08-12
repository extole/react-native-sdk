const path = require('path');

module.exports = {
  dependencies: {
    'extole-mobile-sdk': {
      root: __dirname,
      platforms: {
        android: {
          sourceDir: path.join(__dirname, 'android'),
          packageImportPath: 'import com.extole.android.sdk.ExtoleMobileSdkPackage;',
          packageInstance: 'new ExtoleMobileSdkPackage()',
        },
      },
    },
  },
};
