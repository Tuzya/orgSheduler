function* circle(arr) {
  while (true) {
    yield arr[0];
    arr.push(arr.shift());
  }
}

const days = circle(['Пн', 'Вт', 'Пт']);
for (let i = 0; i < 20; i++) {
  console.log(days.next().value);
}
