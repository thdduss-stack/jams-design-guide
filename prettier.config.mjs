import prettier from '@jds/config-prettier';

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  ...prettier,
  plugins: [...prettier.plugins, 'prettier-plugin-tailwindcss'],
};

export default config;
