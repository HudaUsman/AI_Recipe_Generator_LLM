const fetchBtn = document.getElementById('fetchRecipeBtn');
const resultDiv = document.getElementById('recipeResults');

fetchBtn.addEventListener('click', async () => {
  const ingredients = document.getElementById('ingredientsInput').value.trim();

  if (ingredients === '') {
    alert('Please enter some ingredients');
    return;
  }

  try {
    resultDiv.innerHTML = '<p>Loading recipes...</p>';
    const response = await fetch(`http://localhost:5000/search-by-ingredients?ingredients=${ingredients}`);
    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<p>${data.error}</p>`;
      return;
    }

    resultDiv.innerHTML = ''; // Clear previous

    const container = document.createElement('div');
    container.className = 'recipe-container';

    data.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.className = 'recipe-card';
      recipeCard.innerHTML = `
        <h3>${recipe.title}</h3>
        <img src="${recipe.image}" alt="${recipe.title}">
        <h4>Ingredients:</h4>
        <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
        <h4>Instructions:</h4>
        <p>${recipe.instructions}</p>
      `;
      container.appendChild(recipeCard);
    });

    resultDiv.appendChild(container);

  } catch (error) {
    console.error('Error fetching recipes:', error);
    resultDiv.innerHTML = '<p>Something went wrong. Please try again later.</p>';
  }
});
