document.getElementById("fetchRecipeBtn").addEventListener("click", fetchRandomRecipe);

function fetchRandomRecipe() {
    fetch("http://localhost:5000/random-recipe")
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data); // Debugging

            if (!data || data.length === 0) {
                document.getElementById("randomRecipeResult").innerHTML = "<p>Error fetching recipe. Try again!</p>";
                return;
            }

            // For example, show the first recipe only
            const recipe = data[0]; 

            const recipeHTML = `
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}" style="width: 300px; border-radius: 10px;">
                <h3>Instructions:</h3>
                <p>${recipe.instructions ? recipe.instructions : "No instructions available."}</p>
            `;

            document.getElementById("randomRecipeResult").innerHTML = recipeHTML;
        })
        .catch(error => {
            console.error("Error fetching recipe:", error);
            document.getElementById("randomRecipeResult").innerHTML = "<p>Failed to load recipe. Check console.</p>";
        });
}
