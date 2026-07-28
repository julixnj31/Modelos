import categoriesData from "../data/categories.data.js";

export const CategoryModel = {
  findAll: () => {
    return categoriesData;
  },

  findById: (id) => {
    return categoriesData.find((c) => c.id === id);
  },

  create: (newCategory) => {
    // Generamos un ID basado en la longitud del arreglo (simulación de Auto Increment)
    const id = categoriesData.length + 1;
    const categoryWithId = { id, ...newCategory };
    categoriesData.push(categoryWithId);
    return categoryWithId;
  },

  update: (id, updatedFields) => {
    const index = categoriesData.findIndex((c) => c.id === id);
    if (index === -1) return null;

    // Fusionamos los datos existentes con los campos a actualizar
    categoriesData[index] = { ...categoriesData[index], ...updatedFields };
    return categoriesData[index];
  },

  delete: (id) => {
    const index = categoriesData.findIndex((category) => category.id === id);
    if (index === -1) return false;

    // Eliminamos 1 elemento en la posición encontrada
    categoriesData.splice(index, 1);
    return true;
  },
};