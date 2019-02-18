/* eslint-disable quotes */
import moment from 'moment'; // eslint-disable-line no-unused-vars
function Test(props) { // eslint-disable-line no-unused-vars
  return (
    <form>
      <DatePicker value={moment("2016-11-23", "YYYY-MM-DD")} />
    </form>
  );
}
