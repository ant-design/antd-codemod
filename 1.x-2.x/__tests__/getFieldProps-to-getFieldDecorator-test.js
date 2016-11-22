'use strict';

jest.autoMockOff(); // eslint-disable-line no-undef

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'getFieldProps-to-getFieldDecorator');
