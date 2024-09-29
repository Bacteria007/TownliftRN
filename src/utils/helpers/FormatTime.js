import { isToday, isYesterday, format,parse } from 'date-fns'

export const FormatTime = (createdAt) => {
    // console.log({createdAt});
    const createdAtTimestamp = parse(createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", new Date());
    // Format the time using date-fns format function
    const formattedTime = format(createdAtTimestamp, 'h:mm a');
    return formattedTime;
}
export const GetDay = (createdat) => {

    const messageDate = new Date(createdat);

    let formattedDate = '';
    if (isToday(messageDate)) {
        formattedDate = 'Today';
    } else if (isYesterday(messageDate)) {
        formattedDate = 'Yesterday';
    } else {
        formattedDate = format(messageDate, 'MMMM d, yyyy');
    }

    return formattedDate

}