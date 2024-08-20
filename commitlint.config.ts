import type { UserConfig } from '@commitlint/types';

const regexType = /(TA-[0-9]{1,4}\s(?:feat|fix|init|refactor):)/;
const regexSubject = /\s(.+)/;

const Configuration: UserConfig = {
  parserPreset: {
    parserOpts: {
      headerPattern: new RegExp(`^${regexType.source}${regexSubject.source}$`),
      headerCorrespondence: ['type', 'subject'],
    },
  },
  plugins: [
    {
      rules: {
        'match-commit-name': (parsed) => {
          const { type, subject } = parsed;

          if (type === null || subject === null) {
            return [
              false,
              "Commit must be in format 'TA-123 feat/fix/refactor/init: bla bla'",
            ];
          }

          return [true, ''];
        },
      },
    },
  ],
  rules: {
    'match-commit-name': [2, 'always'],
  },
};

export default Configuration;
