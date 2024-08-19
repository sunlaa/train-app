import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^TA-[0-9]{1,4}\s(feat|fix|init|refactor):\s(.+)$/,
      headerCorrespondence: ['type', 'subject'],
      issuePrefixes: ['^TA-[0-9]{1,4}'],
    },
  },
};

export default Configuration;
