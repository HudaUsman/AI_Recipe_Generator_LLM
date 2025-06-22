const searchDishBtn = document.getElementById('searchDishBtn');
const dishResults = document.getElementById('dishResults');

searchDishBtn.addEventListener('click', async () => {
    const dish = document.getElementById('dishInput').value.trim();

    if (dish === '') {
        alert('Please enter a dish name');
        return;
    }

    try {
        dishResults.innerHTML = '<p>Loading recipes...</p>';
        const response = await fetch(`http://localhost:5000/search-by-dish?dish=${dish}`);
        const data = await response.json();

        if (data.error) {
            dishResults.innerHTML = `<p>${data.error}</p>`;
            return;
        }

        dishResults.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'recipe-container';

        data.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <h3>${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}">
                <h4>Ingredients:</h4>
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                <h4>Instructions:</h4>
                <p>${recipe.instructions}</p>
            `;
            container.appendChild(recipeCard);
        });

        dishResults.appendChild(container);
    } catch (error) {
        console.error('Error fetching dish recipe:', error);
        dishResults.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
});
