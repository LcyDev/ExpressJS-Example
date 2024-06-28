/**
 * A collection of pre-configured Intl.DateTimeFormat objects for different date/time formats.
 * @type {Object}
 */
const dateTimeFormats = {
    /**
     * A date format object that displays the date in 'YYYY-MM-DD' format.
     * @type {Intl.DateTimeFormat}
     */
    date: new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }),

    /**
     * A time format object that displays the time in 'HH:mm:ss' format.
     * @type {Intl.DateTimeFormat}
     */
    time: new Intl.DateTimeFormat('en', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }),

    /**
     * A date-time format object that displays the date and time in 'YYYY-MM-DD HH:mm:ss' format.
     * @type {Intl.DateTimeFormat}
     */
    dateTime: new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }),
};

export default dateTimeFormats;