// SentinelPay script.js
// Person A adds the nav toggle code here
// Person C adds the stat counter code here
const statNumbers = document.querySelectorAll('.stat__number');

statNumbers.forEach((el) => {
  const target = parseInt(el.dataset.count, 10);
  let current = 0;
  const step = Math.ceil(target / 50); // 50 steps to reach the target

  const counter = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(counter);
    }
    el.textContent = current;
  }, 30);
});

