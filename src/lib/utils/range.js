// see https://stackoverflow.com/questions/39924644

/*----------------------------------------------------------------
range
based on Python's range function

example usage:
import range from 'client/lib/utils/range';
let out = Array.from(range(10,20,2));
----------------------------------------------------------------*/
export function* range(start, end, step = 1) {
  while (start < end) {
    yield start;
    start += step;
  }
}
