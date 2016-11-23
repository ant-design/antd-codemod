# antd-codemod

[![](https://img.shields.io/travis/ant-design/antd-codemod.svg?style=flat-square)](https://travis-ci.org/ant-design/antd-codemod)
[![Dependency Status](https://david-dm.org/ant-design/antd-codemod.svg?style=flat-square)](https://david-dm.org/ant-design/antd-codemod)

This repository contains a collection of codemod scripts based for use with [JSCodeshift](https://github.com/facebook/jscodeshift) that help update `antd` APIs.

## Setup & Run

* `npm install -g jscodeshift`
* `git clone https://github.com/ant-design/antd-codemod.git` or download a zip file from `https://github.com/ant-design/antd-codemod/archive/master.zip`
* Run `npm install` in the antd-codemod directory
* `jscodeshift -t <codemod-script> <path>`
* Use the `-d` option for a dry-run and use `-p` to print the output for comparison

## Included Scripts

### 1.x-2.x

`getFieldProps-to-getFieldDecorator`

Replace `getFieldProps` with `getFieldDecorator`.

```bash
jscodeshift -t path-to/antd-codemod/1.x-2.x/getFieldProps-to-getFieldDecorator.js <path>
```

## License

MIT
