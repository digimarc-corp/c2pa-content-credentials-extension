import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: 'black',
  colorSecondary: '#ffca32',

  appBg: '#f1ede9',
  appContentBg: 'white',
  appBorderRadius: 4,

  textColor: 'black',
  textInverseColor: 'black',

  barTextColor: 'black',
  barSelectedColor: '#ffca32',
  barBg: 'white',

  brandTitle: 'CAI Web Components',
  brandUrl: 'https://js-sdk.contentauthenticity.org/',
  brandImage:
    'https://images.squarespace-cdn.com/content/v1/60d0a2a4d571dc3fb759f38f/2913aa94-c82f-461c-b647-dcdcaa5b365a/CAI_Lockup_RGB_Black.png?format=1500w',
});
