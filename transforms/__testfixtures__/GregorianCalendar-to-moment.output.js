import React from 'react';

const handleChange = function handleChange(date) {
  console.log(date.valueOf());
};

const NormalForm = React.createClass({ // eslint-disable-line no-unused-vars
  disabledDate(date) {
    console.log(date.valueOf());
  },
  disabledTime: date => {
    console.log(date.valueOf());
  },
  render() {
    return (
      <form>
        <DatePicker
          disabledDate={this.disabledDate}
          disabledTime={this.disabledTime}
          onChange={handleChange}
        />
      </form>
    );
  },
});

function handlePanelChange(date) {
  console.log(date.valueOf());
}

class ClassForm extends React.Component { // eslint-disable-line no-unused-vars
  dateCellRender(date) {
    return <div>{date.date()}</div>;
  }

  monthCellRender = date => {
    return <div>{date.month()}</div>;
  }

  render() {
    return (
      <form>
        <Calendar
          dateCellRender={this.dateCellRender.bind(this)}
          monthCellRender={this.monthCellRender}
          onPanelChange={handlePanelChange}
        />
      </form>
    );
  }
}
