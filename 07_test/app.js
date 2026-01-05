function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Inputs must be numbers.');
  }
  if (b === 0) {
    throw new Error('Cannot divide by zero.');
  }
  return a / b;
}

function multiplication(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Inputs must be numbers.');
  }
  return a * b;
}
