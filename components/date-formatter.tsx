import { parseISO, format } from "date-fns";
import es from "date-fns/locale/es";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString = "" }: Props) => {
  if (!dateString) return null;

  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) {
      return <time dateTime={dateString}>{dateString}</time>;
    }
    return (
      <time dateTime={dateString}>
        {format(date, "d 'de' MMMM, yyyy", { locale: es })}
      </time>
    );
  } catch {
    return <time dateTime={dateString}>{dateString}</time>;
  }
};

export default DateFormatter;
