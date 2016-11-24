import moment from 'moment';
/* eslint-disable quotes */
function Test(props) { // eslint-disable-line no-unused-vars
  const time = '00:00:00';
  const dateFormat = "YYYY-MM-DD HH:mm:ss";
  return (
    <form>
      {/* all the time-related components should workd */}
      <DatePicker value={moment("2016-11-23", "YYYY-MM-DD")} />
      <MonthPicker value={moment("2016-11", "YYYY-MM")} />
      <TimePicker value={moment(time, "HH:mm:ss")} />
      <Calendar value={moment(props.date, "YYYY-MM-DD")} />

      {/* should handle `defaultValue` and `format`, too */}
      <DatePicker
        defaultValue={moment('2016-11-23 00:00:00', "YYYY-MM-DD HH:mm:ss")}
        showTime format="YYYY-MM-DD HH:mm:ss"
      />
      <DatePicker
        defaultValue={moment('2016-11-23 00:00:00', dateFormat)}
        showTime format={dateFormat}
      />
    </form>
  );
}
