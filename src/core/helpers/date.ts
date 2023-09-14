import moment from "moment";

export const formatDate = (
  value: string | null | Date,
  formatStr = "DD/MM/YYYY"
): string => {
  if (value) {
    return moment(new Date(value)).format(formatStr);
  }
  return "";
};
