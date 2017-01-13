'use strict';

jest.autoMockOff(); // eslint-disable-line no-undef

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'time-related-value-to-moment');
defineTest(__dirname, 'time-related-value-to-moment', null, 'time-related-value-to-moment.with-moment');
