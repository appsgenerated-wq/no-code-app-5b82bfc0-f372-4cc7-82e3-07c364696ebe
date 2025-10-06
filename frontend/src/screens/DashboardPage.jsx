import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightOnRectangleIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState({}); // { restaurantId: [items] }
  const [isLoading, setIsLoading] = useState(true);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '' });

  const loadRestaurants = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Restaurant').find({
        filter: { owner: user.id },
        sort: { createdAt: 'desc' },
        include: ['owner']
      });
      setRestaurants(response.data);
      response.data.forEach(restaurant => loadMenuItems(restaurant.id));
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest, user.id]);

  const loadMenuItems = async (restaurantId) => {
    try {
      const response = await manifest.from('MenuItem').find({
        filter: { restaurant: restaurantId },
        sort: { createdAt: 'asc' }
      });
      setMenuItems(prev => ({ ...prev, [restaurantId]: response.data }));
    } catch (error) {
      console.error(`Failed to load menu items for restaurant ${restaurantId}:`, error);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurantName.trim()) return;
    try {
      await manifest.from('Restaurant').create({ name: newRestaurantName, owner: user.id });
      setNewRestaurantName('');
      loadRestaurants();
    } catch (error) {
      console.error('Failed to create restaurant:', error);
    }
  };
  
  const handleDeleteRestaurant = async (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant and all its menu items?')) {
      try {
        await manifest.from('Restaurant').delete(restaurantId);
        loadRestaurants();
      } catch (error) {
        console.error('Failed to delete restaurant:', error);
      }
    }
  };

  const handleCreateMenuItem = async (e, restaurantId) => {
    e.preventDefault();
    const { name, description, price } = newMenuItem;
    if (!name.trim() || !price) return;
    try {
      await manifest.from('MenuItem').create({
        name,
        description,
        price: parseFloat(price),
        restaurant: restaurantId,
        owner: user.id
      });
      setNewMenuItem({ name: '', description: '', price: '' });
      loadMenuItems(restaurantId);
    } catch (error) {
      console.error('Failed to create menu item:', error);
    }
  };
  
  const handleDeleteMenuItem = async (menuItemId, restaurantId) => {
     if (window.confirm('Are you sure you want to delete this menu item?')) {
        try {
          await manifest.from('MenuItem').delete(menuItemId);
          loadMenuItems(restaurantId);
        } catch (error) {
          console.error('Failed to delete menu item:', error);
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Welcome, {user.name}!</h1>
          <div className="flex items-center space-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600">Admin Panel</a>
            <button onClick={onLogout} className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600">
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a New Restaurant</h2>
          <form onSubmit={handleCreateRestaurant} className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Restaurant Name"
              value={newRestaurantName}
              onChange={(e) => setNewRestaurantName(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <PlusCircleIcon className="w-5 h-5 mr-2"/>
              Create
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Restaurants</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading your restaurants...</p>
          ) : restaurants.length === 0 ? (
            <p className="text-gray-500">You haven't added any restaurants yet. Add one above to get started.</p>
          ) : (
            <div className="space-y-8">
              {restaurants.map(restaurant => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 flex justify-between items-start">
                    <div>
                       <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                       <p className="text-sm text-gray-500">{restaurant.description || 'No description'}</p>
                    </div>
                    <button onClick={() => handleDeleteRestaurant(restaurant.id)} className="text-gray-400 hover:text-red-600">
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-4 border-t">
                     <h4 className="text-md font-semibold text-gray-700 mb-4">Menu Items</h4>
                      {(menuItems[restaurant.id] || []).length > 0 &&
                        <ul className="space-y-3 mb-4">
                          {(menuItems[restaurant.id] || []).map(item => (
                            <li key={item.id} className="flex justify-between items-center bg-white p-3 rounded-md border">
                              <div>
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.description}</p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <p className="font-semibold text-green-600">${item.price}</p>
                                <button onClick={() => handleDeleteMenuItem(item.id, restaurant.id)} className="text-gray-400 hover:text-red-500">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      }
                      <form onSubmit={(e) => handleCreateMenuItem(e, restaurant.id)} className="space-y-3">
                        <div className="flex space-x-3">
                           <input type="text" placeholder="Item Name" value={newMenuItem.name} onChange={e => setNewMenuItem({...newMenuItem, name: e.target.value})} className="flex-grow px-3 py-2 border rounded-md text-sm" required />
                           <input type="number" placeholder="Price" value={newMenuItem.price} onChange={e => setNewMenuItem({...newMenuItem, price: e.target.value})} className="w-24 px-3 py-2 border rounded-md text-sm" required step="0.01"/>
                        </div>
                        <textarea placeholder="Description" value={newMenuItem.description} onChange={e => setNewMenuItem({...newMenuItem, description: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm" rows="2"/>
                        <button type="submit" className="w-full text-sm bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Add Menu Item</button>
                      </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
