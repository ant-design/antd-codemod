import React from 'react';
import { Form } from 'antd';

const NormalForm = Form.create()(React.createClass({ // eslint-disable-line no-unused-vars
  render() {
    const { getFieldDecorator } = this.props.form;
    const nameField = (
      getFieldDecorator('name', {
        rules: [{ required: true, message: 'Please input your name!' }],
      })(<input type="text" />)
    );
    return (
      <form>
        {nameField}
        {getFieldDecorator('password')(<input type="password" />)}
      </form>
    );
  },
}));

function StatelessForm(props) { // eslint-disable-line no-unused-vars
  const getFieldDecorator = props.form.getFieldDecorator;

  const nameDecorator = getFieldDecorator('name', {
    rules: [{ required: true, message: 'Please input your name!' }],
  });
  const nameField = nameDecorator(<input type="text" />);

  const passwordDecorator = getFieldDecorator('password');
  return (
    <form>
      {nameField}
      {passwordDecorator(<input type="password" />)}
    </form>
  );
}
