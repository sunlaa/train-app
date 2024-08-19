import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'subject-empty': [0, 'always'],
    'type-empty': [0, 'always'],
  },
  //   parserPreset: {
  //     parserOpts: {
  //       headerPattern: /^[TA]-[0-9]-(feat|fix|init|refactor):-.+$/,
  //       headerCorrespondence: ['type', 'subject'],
  //       issuePrefixes: ['^[TA]-[0-9]'],
  //     },
  //   },
};

export default Configuration;
