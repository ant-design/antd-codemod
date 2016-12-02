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

#### `getFieldProps-to-getFieldDecorator`

Replace deprecated `getFieldProps` with newer `getFieldDecorator`:

```diff
-  <Input placeholder="text" {...getFieldProps('userName', { ... })} />
+  {getFieldDecorator('userName', { ... })(
+    <Input placeholder="text" />
+  )}
```

#### `Popover-overlay-to-content`

`Popover[overlay]` is removed, so we need to replace it with `Popover[content]`:

```diff
- <Popover overlay={...} />
+ <Popover content={...} />
```

#### `time-related-value-to-moment`

Update `value` `defaultValue` and `format` of `DatePicker` `TimePicker` `Calendar` `MonthPicker`(not support `RangePicker` now):

```diff
+ import moment from 'moment';

  <DatePicker
-   defaultValue="2016-11-24 00:00:00"
+   defaultValue={moment('2016-11-24 00:00:00', 'YYYY-MM-DD HH:mm:ss')}
    showTime
-   format="yyyy-MM-dd HH:mm:ss"
+   format="YYYY-MM-DD HH:mm:ss"
  />
```

#### `GergorianCalendar-to-moment`

Update GregorianCalendar's APIs to moment's APIs.

```diff
function disabledDate(date) {
- console.log(date.getTime());
+ console.log(date.valueOf());
}
```

## License

MIT
