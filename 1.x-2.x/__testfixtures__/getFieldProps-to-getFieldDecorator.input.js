import React from 'react';
import { Form } from 'antd';

const NormalForm = Form.create()(React.createClass({ // eslint-disable-line no-unused-vars
  render() {
    const { getFieldProps } = this.props.form;
    const nameField = (
      <input {...getFieldProps('name', {
        rules: [{ required: true, message: 'Please input your name!' }],
      })} type="text" />
    );
    return (
      <form>
        {nameField}
        <input {...getFieldProps('password')} type="password" />
      </form>
    );
  },
}));

function StatelessForm(props) { // eslint-disable-line no-unused-vars
  const getFieldProps = props.form.getFieldProps;

  const nameProps = getFieldProps('name', {
    rules: [{ required: true, message: 'Please input your name!' }],
  });
  const nameField = <input {...nameProps} type="text" />;

  const passwordProps = getFieldProps('password');
  return (
    <form>
      {nameField}
      <input {...passwordProps} type="password" />
    </form>
  );
}
