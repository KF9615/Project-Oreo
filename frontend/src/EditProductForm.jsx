import { useState } from "react";

function EditProductForm({
    product,
    onProductUpdate,
    onCancel,
}) {
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
    })

    const [error, setError] = useState('')

    function handleChange(event) {
        const {name, value} = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        setError('')

        const updatedProduct = {
            ...formData,
            price: Number(formData.price),
        }

        fetch(`http://localhost:8080/api/products/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error('Unable to update Product')
            }

            return response.json()
        })
        .then((savedProduct) => {
            onProductUpdated(savedProduct)
        })
        .catch((error) => {
            setError(error.message)
        })
    }

    return(
        <section>
            <h2>Edit Product</h2>

            <form onSubmit={handleSubmit}>
                <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                />

                                <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                />

                <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                />

                <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                />

                <button type="submit">Save</button>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>

            {error && <p>{error}</p>}
        </section>
    )
}

export default EditProductForm