const meals = [
  {
    meal: '早餐',
    title: '早餐 · 包子和牛奶',
    foods: [['两个包子', '约 420 kcal'], ['牛奶', '约 120 kcal']],
    calories: 540,
    confidence: ['medium', '可信度：中 · 包子馅料不确定']
  },
  {
    meal: '午餐',
    title: '午餐 · 商圈套餐',
    foods: [['米饭', '约 280 kcal'], ['鸡肉和青菜', '约 470 kcal'], ['例汤', '约 100 kcal']],
    calories: 850,
    confidence: ['low', '可信度：低 · 油量和米饭量不确定']
  },
  {
    meal: '晚餐',
    title: '晚餐 · 香蕉和鸡蛋',
    foods: [['香蕉', '约 105 kcal'], ['鸡蛋', '约 78 kcal']],
    calories: 183,
    confidence: ['high', '可信度：高 · 单一食物更容易估算']
  },
  {
    meal: '加餐',
    title: '加餐 · 酸奶',
    foods: [['无糖酸奶', '约 140 kcal']],
    calories: 140,
    confidence: ['high', '可信度：高 · 包装食品可校准']
  }
];

let selectedMeal = '午餐';
let currentMealIndex = 1;
let adjustmentFactor = 1;

const chips = document.querySelectorAll('.meal-chip');
const foodList = document.querySelector('#food-list');
const mealTitle = document.querySelector('#meal-title');
const mealCalories = document.querySelector('#meal-calories');
const confidencePill = document.querySelector('#confidence-pill');
const captureButton = document.querySelector('#capture-button');

function renderMeal(index) {
  const meal = meals[index];
  selectedMeal = meal.meal;
  mealTitle.textContent = meal.title;
  foodList.innerHTML = meal.foods.map(([name, kcal]) => `<li><b>${name}</b><span>${kcal}</span></li>`).join('');
  mealCalories.textContent = `${Math.round(meal.calories * adjustmentFactor)} kcal`;
  confidencePill.className = `confidence-pill ${meal.confidence[0]}`;
  confidencePill.textContent = meal.confidence[1];
  chips.forEach((chip) => chip.classList.toggle('active', chip.dataset.meal === selectedMeal));
}

chips.forEach((chip, index) => {
  chip.addEventListener('click', () => {
    currentMealIndex = index;
    adjustmentFactor = 1;
    renderMeal(currentMealIndex);
  });
});

document.querySelectorAll('.segmented').forEach((group) => {
  group.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    group.querySelectorAll('button').forEach((button) => button.classList.remove('selected'));
    event.target.classList.add('selected');
    const value = event.target.dataset.value;
    adjustmentFactor = value === '多' || value === '重油' ? 1.15 : value === '少' || value === '少油' ? 0.9 : 1;
    renderMeal(currentMealIndex);
  });
});

captureButton.addEventListener('click', () => {
  currentMealIndex = (currentMealIndex + 1) % meals.length;
  adjustmentFactor = 1;
  renderMeal(currentMealIndex);
});

renderMeal(currentMealIndex);
