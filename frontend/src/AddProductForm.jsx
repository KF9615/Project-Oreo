import { useState } from "react";

function AddProductForm({ onProductAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
    })

    const [error, setError] = useState('')

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        setError('')

        const product = {
            ...formData,
            price: Number(formData.price),
        }

        fetch('http://localhost:8080/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unable to add product')
                }

                return response.json()
            })
            .then((savedProduct) => {
                onProductAdded(savedProduct)

                setFormData({
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                })
            })
            .catch((error) => {
                setError(error.message)
            })
    }

    return (
        <section>
            <h2>Add Product</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Description
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Category
                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Price
                    <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit">Add Product</button>
            </form>

            {error && <p>{error}</p>}
        </section>
    )
}

export default AddProductForm