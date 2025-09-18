import React, { useState, useEffect } from 'react';
import type { Product, Category, Brand } from '../types';

interface AdminPageProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  onAddProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  onDeleteProduct: (productId: number) => void;
  onAddCategory: (categoryData: Omit<Category, 'id'>) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateCategory: (categoryId: string, newName: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  products, categories, brands,
  onAddProduct, onDeleteProduct, onAddCategory, onDeleteCategory, onUpdateCategory
}) => {
  const initialFormState = { name: '', price: '', description: '', longDescription: '', category: categories[0]?.id || '', brand: brands[0]?.id || '', videoUrl: '', stockQuantity: '' };
  const [productForm, setProductForm] = useState(initialFormState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoInputType, setVideoInputType] = useState<'url' | 'upload'>('url');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState('https://picsum.photos/seed/new-cat/400/300');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };
  
  useEffect(() => {
    const newUrls = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(newUrls);

    return () => {
        newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  useEffect(() => {
    let objectUrl: string | null = null;
    
    if (videoInputType === 'upload' && videoFile) {
        objectUrl = URL.createObjectURL(videoFile);
        setVideoPreviewUrl(objectUrl);
    } else if (videoInputType === 'url' && productForm.videoUrl) {
        const embedUrl = getEmbedUrl(productForm.videoUrl);
        setVideoPreviewUrl(embedUrl);
    } else {
        setVideoPreviewUrl(null);
    }

    return () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    };
  }, [videoFile, productForm.videoUrl, videoInputType]);

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files).slice(0, 5);
        setImageFiles(files);
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setVideoFile(e.target.files[0]);
    }
  };
  
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.brand) {
      alert("Please fill all required fields.");
      return;
    }
    
    const imageUrls = imageFiles.map(file => URL.createObjectURL(file));
    let finalVideoUrl = '';
    if (videoInputType === 'url') {
      finalVideoUrl = productForm.videoUrl;
    } else if (videoFile) {
      finalVideoUrl = URL.createObjectURL(videoFile);
    }

    onAddProduct({
      name: productForm.name,
      price: parseFloat(productForm.price),
      description: productForm.description,
      longDescription: productForm.longDescription,
      category: productForm.category,
      brand: productForm.brand,
      stockQuantity: parseInt(productForm.stockQuantity, 10) || 0,
      imageUrls: imageUrls,
      videoUrl: finalVideoUrl,
    });
    setProductForm(initialFormState);
    setImageFiles([]);
    setVideoFile(null);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
        alert("Category name cannot be empty.");
        return;
    }
    onAddCategory({ name: newCategoryName, imageUrl: newCategoryImageUrl });
    setNewCategoryName('');
    setNewCategoryImageUrl('https://picsum.photos/seed/new-cat/400/300');
  };

  const handleUpdateCategorySubmit = (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    onUpdateCategory(categoryId, editingCategoryName);
    setEditingCategoryId(null);
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 border-b pb-4">Add New Product</h2>
        <form onSubmit={handleAddProductSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" name="name" value={productForm.name} onChange={handleProductFormChange} placeholder="Product Name" className="p-2 border rounded" required />
                <input type="number" name="price" value={productForm.price} onChange={handleProductFormChange} placeholder="Price" className="p-2 border rounded" required step="0.01" />
                <input type="number" name="stockQuantity" value={productForm.stockQuantity} onChange={handleProductFormChange} placeholder="Stock Quantity" className="p-2 border rounded" required />
                <select name="category" value={productForm.category} onChange={handleProductFormChange} className="p-2 border rounded" required>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="brand" value={productForm.brand} onChange={handleProductFormChange} className="p-2 border rounded" required>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            
            <textarea name="description" value={productForm.description} onChange={handleProductFormChange} placeholder="Short Description" className="p-2 border rounded w-full" rows={2}></textarea>
            <textarea name="longDescription" value={productForm.longDescription} onChange={handleProductFormChange} placeholder="Long Description" className="p-2 border rounded w-full" rows={4}></textarea>
            
            <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (up to 5)</label>
                <input type="file" name="images" multiple accept="image/*" onChange={handleImageFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                {imagePreviewUrls.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                    {imagePreviewUrls.map((url, index) => (
                        <div key={url} className="relative">
                            <img src={url} alt={`preview ${index}`} className="w-24 h-24 object-cover rounded-lg shadow-md" />
                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">&times;</button>
                        </div>
                    ))}
                    </div>
                )}
            </div>

            <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Video</label>
                <div className="flex gap-4 mb-2">
                    <label><input type="radio" name="videoType" value="url" checked={videoInputType === 'url'} onChange={() => setVideoInputType('url')} className="mr-1" /> Embed URL</label>
                    <label><input type="radio" name="videoType" value="upload" checked={videoInputType === 'upload'} onChange={() => setVideoInputType('upload')} className="mr-1" /> Upload File</label>
                </div>
                {videoInputType === 'url' ? (
                    <input type="text" name="videoUrl" value={productForm.videoUrl} onChange={handleProductFormChange} placeholder="e.g., YouTube link" className="p-2 border rounded w-full" />
                ) : (
                    <input type="file" name="videoFile" accept="video/*" onChange={handleVideoFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                )}
                {videoPreviewUrl && (
                    <div className="mt-4 border rounded-lg overflow-hidden aspect-video bg-black flex items-center justify-center">
                        {videoPreviewUrl.includes('youtube.com/embed') ? (
                            <iframe 
                                src={videoPreviewUrl} 
                                title="Video Preview" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen 
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                            <video 
                                src={videoPreviewUrl} 
                                controls 
                                className="w-full h-full max-h-[400px]"
                            ></video>
                        )}
                    </div>
                )}
            </div>
            
            <button type="submit" className="w-full px-4 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 mt-4">Add Product</button>
        </form>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Stock</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4">{categories.find(c=>c.id === p.category)?.name || p.category}</td>
                  <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{p.stockQuantity}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => {
                      if (window.confirm("Are you sure you want to delete this product?")) {
                        onDeleteProduct(p.id);
                      }
                    }} className="font-medium text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
        <form onSubmit={handleAddCategorySubmit} className="flex flex-col sm:flex-row gap-4 mb-8 border-b pb-8">
          <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New Category Name" className="p-2 border rounded flex-grow" required />
          <input type="text" value={newCategoryImageUrl} onChange={e => setNewCategoryImageUrl(e.target.value)} placeholder="Category Image URL" className="p-2 border rounded flex-grow" required />
          <button type="submit" className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600">Add Category</button>
        </form>
        <ul className="space-y-2">
          {categories.map(c => (
            <li key={c.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-100">
              {editingCategoryId === c.id ? (
                <form onSubmit={(e) => handleUpdateCategorySubmit(e, c.id)} className="flex-grow flex items-center gap-2">
                  <input type="text" value={editingCategoryName} onChange={e => setEditingCategoryName(e.target.value)} className="p-1 border rounded w-full" autoFocus />
                  <button type="submit" className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                  <button type="button" onClick={() => setEditingCategoryId(null)} className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancel</button>
                </form>
              ) : (
                <>
                  <span className="flex-grow">{c.name}</span>
                  <div className="flex gap-4">
                    <button onClick={() => { setEditingCategoryId(c.id); setEditingCategoryName(c.name); }} className="font-medium text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => {
                      if (window.confirm("Are you sure you want to delete this category? This will also delete all products in this category.")) {
                        onDeleteCategory(c.id);
                      }
                    }} className="font-medium text-red-600 hover:underline">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
export default AdminPage;