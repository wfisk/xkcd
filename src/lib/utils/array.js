// Remove all null or undefine values
export function arrayClean(array) {
  return array.filter((it) => it !== null && it !== undefined);
}

// see https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
export function arrayFlatten(array) {
  return [].concat(...array);
}

// see https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
export function arrayUnique(array) {
  return array.filter((value, index, self) => self.indexOf(value) === index);
}

// see https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values
export function compareBy(field, reverse, primer) {
  const key = primer
    ? function (x) {
        return primer(x[field]);
      }
    : function (x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
}

export function compareByNoCase(field, reverse, primer) {
  const key = primer
    ? function (x) {
        return primer(x[field]);
      }
    : function (x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    a = key(a);
    b = key(b);

    if (a && a.toUpperCase) {
      a = a.toUpperCase();
    }
    if (b && b.toUpperCase) {
      b = b.toUpperCase();
    }
    return reverse * ((a > b) - (b > a));
  };
}
