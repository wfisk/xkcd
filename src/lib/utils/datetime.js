export function isTimestamp(value) {
  if (
    value.hasOwnProperty('seconds') &&
    value.hasOwnProperty('nanoseconds') &&
    typeof value.toDate === 'function'
  ) {
    return true;
  }

  return false;
}
