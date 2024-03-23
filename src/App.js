import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [editedCategory, setEditedCategory] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios.get('https://api.escuelajs.co/api/v1/categories')
      .then(response => {
        setCategories(response.data instanceof Array ? response.data : []);
      })
      .catch(error => {
        setErrorMessage('Error fetching categories');
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editedCategory) {
      setEditedCategory({ ...editedCategory, [name]: value });
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editedCategory) {
      axios.put(`https://api.escuelajs.co/api/v1/categories/${editedCategory.id}`, editedCategory)
        .then(response => {
          setCategories(categories.map(category => (category.id === editedCategory.id ? response.data : category)));
          setEditedCategory(null);
          setSuccessMessage('Category updated successfully');
        })
        .catch(error => {
          setErrorMessage('Error updating category');
        });
    } else {
      axios.post('https://api.escuelajs.co/api/v1/categories/', newCategory)
        .then(response => {
          setCategories([...categories, response.data]);
          setNewCategory({ name: "", image: "" });
          setSuccessMessage('Category added successfully');
        })
        .catch(error => {
          setErrorMessage('Error adding category');
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`https://api.escuelajs.co/api/v1/categories/${id}`)
      .then(() => {
        setCategories(categories.filter(category => category.id !== id));
        setSuccessMessage('Category deleted successfully');
      })
      .catch(error => {
        setErrorMessage('Error deleting category');
      });
  };

  const handleEdit = (category) => {
    setEditedCategory(category);
    setNewCategory({ name: "", image: "" }); 
  };

  return (
    <div className="container">
      <h1>Categories</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" className="form-control" id="name" name="name" value={newCategory.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input type="text" className="form-control" id="image" name="image" value={newCategory.image} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Add Category</button>
      </form>
      <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
        {categories.map(category => (
          <div className="col" key={category.id}>
            <div className="card">
              <img src={category.image} className="card-img-top" alt={category.name} />
              <div className="card-body">
                {editedCategory && editedCategory.id === category.id ? (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="editName">Name:</label>
                      <input type="text" className="form-control" id="editName" name="name" value={editedCategory.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="editImage">Image URL:</label>
                      <input type="text" className="form-control" id="editImage" name="image" value={editedCategory.image} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                  </form>
                ) : (
                  <>
                    <h5 className="card-title">{category.name}</h5>
                    <button className="btn btn-primary me-2" onClick={() => handleEdit(category)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(category.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;