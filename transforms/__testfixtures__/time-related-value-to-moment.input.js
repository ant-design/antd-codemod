/* eslint-disable quotes */
function Test(props) { // eslint-disable-line no-unused-vars
  const time = '00:00:00';
  const dateFormat = 'yyyy-MM-dd HH:mm:ss';
  return (
    <form>
      {/* all the time-related components should workd */}
      <DatePicker value="2016-11-23" />
      <MonthPicker value="2016-11" />
      <TimePicker value={time} />
      <Calendar value={props.date} />

      {/* should handle `defaultValue` and `format`, too */}
      <DatePicker
        defaultValue={'2016-11-23 00:00:00'}
        showTime format="yyyy-MM-dd HH:mm:ss"
      />
      <DatePicker
        defaultValue={'2016-11-23 00:00:00'}
        showTime format={dateFormat}
      />
    </form>
  );
}
