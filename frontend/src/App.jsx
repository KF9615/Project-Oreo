import { useEffect, useState } from 'react'
import AddProductForm from './AddProductForm.jsx'
import EditProductForm from './EditProductForm.jsx'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/api/products').then((response) => {
      if (!response.ok) {
        throw new Error('Unable to load products')
      }

      return response.json()
    }).then((data) => {
      setProducts(data)
    })
      .catch((error) => {
        setError(error.message)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  function handleProductAdded(newProduct) {
    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ])
  }

  function handleDelete(productId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmed) {
      return
    }

    fetch(`http://localhost:8080/api/products/${productId}`, { method: 'DELETE', })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to delete product')
        }

        setProducts((currentProducts) =>
          currentProducts.filter(
            (product) => product.id !== productId
          ))
      })
      .catch((error) => {
        setError(error.message)
      })
  }

  function handleProductUpdated(updatedProduct) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      ))

    setEditingProduct(null)
  }

  return (
    <main className='app'>
      <header className='app-header'>
        <h1>Oreo Botanicals</h1>
        <p>Skincare Product Manager</p>
      </header>

      <AddProductForm onProductAdded={handleProductAdded} />

      {editingProduct && (
        <EditProductForm
          key={editingProduct.id}
          product={editingProduct}
          onProductUpdated={handleProductUpdated}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      <section className='products-section'>

        <h2> Products</h2>

        {loading && <p>Loading products...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p>No products found.</p>
        )}

        <ul className='product-grid'>
          {products.map((product) => {
            return (

            <li className='product-card' key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p className='price'>${product.price.toFixed(2)}</p>

              <div className='product-actions'>
                <button
                  className='edit-button'
                  type="button"
                  onClick={() => setEditingProduct(product)}
                >Edit</button>

                <button
                  className='delete-button'
                  type="button"
                  onClick={() => handleDelete(product.id)}
                > Delete </button>
              </div>
            </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}

export default App
