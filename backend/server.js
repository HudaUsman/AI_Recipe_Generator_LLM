require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

// ---------------- Random Recipe ----------------
app.get("/random-recipe", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key is missing!" });

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random`,
      {
        params: {
          apiKey,
          number: 3,
        },
      }
    );

    const recipes = response.data.recipes.map((recipe) => ({
      title: recipe.title,
      image: recipe.image,
      instructions: recipe.instructions || "No instructions available.",
    }));

    res.json(recipes);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch random recipes" });
  }
});

// ---------------- Search by Ingredients ----------------
app.get("/search-by-ingredients", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const ingredients = req.query.ingredients;

    if (!apiKey) return res.status(500).json({ error: "API key is missing!" });
    if (!ingredients)
      return res.status(400).json({ error: "Ingredients required!" });

    const searchResponse = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients`,
      {
        params: {
          ingredients,
          number: 3,
          apiKey,
        },
      }
    );

    const recipes = searchResponse.data;
    if (recipes.length === 0)
      return res.status(404).json({ error: "No recipes found!" });

    const detailedRecipes = await Promise.all(
      recipes.map(async (r) => {
        const details = await axios.get(
          `https://api.spoonacular.com/recipes/${r.id}/information`,
          {
            params: { apiKey },
          }
        );
        return {
          title: details.data.title,
          image: details.data.image,
          instructions:
            details.data.instructions || "No instructions available.",
          ingredients: details.data.extendedIngredients.map((i) => i.original),
        };
      })
    );

    res.json(detailedRecipes);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// ---------------- Search by Dish Name ----------------
app.get("/search-by-dish", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const query = req.query.dish;

    if (!apiKey) return res.status(500).json({ error: "API key is missing!" });
    if (!query)
      return res.status(400).json({ error: "Dish name is required!" });

    const searchResponse = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: {
          query: query,
          number: 3,
          apiKey,
        },
      }
    );

    const recipes = searchResponse.data.results;
    if (recipes.length === 0)
      return res.status(404).json({ error: "No recipe found!" });

    const detailedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const detail = await axios.get(
          `https://api.spoonacular.com/recipes/${recipe.id}/information`,
          { params: { apiKey } }
        );
        return {
          title: detail.data.title,
          image: detail.data.image,
          instructions:
            detail.data.instructions || "No instructions available.",
          ingredients: detail.data.extendedIngredients.map((i) => i.original),
        };
      })
    );

    res.json(detailedRecipes);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch recipe by dish" });
  }
});

// ---------------- Server ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
