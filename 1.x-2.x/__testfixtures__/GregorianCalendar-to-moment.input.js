import React from 'react';

const handleChange = function handleChange(date) {
  console.log(date.getTime());
};

const NormalForm = React.createClass({ // eslint-disable-line no-unused-vars
  disabledDate(date) {
    console.log(date.getTime());
  },
  disabledTime: date => {
    console.log(date.getTime());
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
  console.log(date.getTime());
}

class ClassForm extends React.Component { // eslint-disable-line no-unused-vars
  dateCellRender(date) {
    return <div>{date.getDayOfMonth()}</div>;
  }

  monthCellRender = date => {
    return <div>{date.getMonth()}</div>;
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
