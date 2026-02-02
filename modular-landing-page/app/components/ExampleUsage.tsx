/**
 * Example component showing how to use the API service with Zustand store
 * This is a reference implementation - adapt to your needs
 */

'use client';

import { useEffect } from 'react';
import { useExampleStore } from '../store/example.store';

export default function ExampleUsage() {
  const {
    users,
    products,
    loading,
    error,
    fetchUsers,
    fetchProducts,
    createUser,
    deleteUser,
    clearError,
  } = useExampleStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchProducts({ limit: 10 });
  }, [fetchUsers, fetchProducts]);

  const handleCreateUser = async () => {
    await createUser({
      name: 'New User',
      email: 'newuser@example.com',
    });
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <div className="flex items-center justify-between">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Users Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <button
            onClick={handleCreateUser}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <p className="text-gray-500 text-center py-8">No users found</p>
        )}
      </section>

      {/* Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600 text-sm my-2">
                {product.description}
              </p>
              <p className="text-lg font-bold text-green-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-gray-500 text-center py-8">No products found</p>
        )}
      </section>
    </div>
  );
}
