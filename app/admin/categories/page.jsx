'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORY_KEY = 'velmora_admin_categories'

const defaultCategories = [
    { id: 'cat_1', name: 'Men', subcategories: ['T-Shirts', 'Jeans', 'Hoodies'] },
    { id: 'cat_2', name: 'Women', subcategories: ['Dresses', 'Tops', 'Jeans'] },
    { id: 'cat_3', name: 'Kids', subcategories: ['Shirts', 'Shorts', 'Winterwear'] },
]

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState('')
    const [subcatInput, setSubcatInput] = useState({})

    useEffect(() => {
        try {
            const stored = localStorage.getItem(CATEGORY_KEY)
            setCategories(stored ? JSON.parse(stored) : defaultCategories)
        } catch {
            setCategories(defaultCategories)
        }
    }, [])

    useEffect(() => {
        if (categories.length) {
            localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories))
        }
    }, [categories])

    const addCategory = () => {
        if (!name.trim()) return toast.error('Category name is required')
        setCategories((prev) => [...prev, { id: `cat_${Date.now()}`, name: name.trim(), subcategories: [] }])
        setName('')
        toast.success('Category added')
    }

    const removeCategory = (id) => {
        setCategories((prev) => prev.filter((item) => item.id !== id))
        toast.success('Category removed')
    }

    const addSubcategory = (categoryId) => {
        const value = (subcatInput[categoryId] || '').trim()
        if (!value) return toast.error('Subcategory name required')
        setCategories((prev) => prev.map((item) => item.id === categoryId ? {
            ...item,
            subcategories: [...item.subcategories, value],
        } : item))
        setSubcatInput((prev) => ({ ...prev, [categoryId]: '' }))
        toast.success('Subcategory added')
    }

    const removeSubcategory = (categoryId, subcategory) => {
        setCategories((prev) => prev.map((item) => item.id === categoryId ? {
            ...item,
            subcategories: item.subcategories.filter((entry) => entry !== subcategory),
        } : item))
    }

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Category Management</h1>
            <p className='text-sm mt-1'>Add/edit/delete categories and subcategories.</p>

            <div className='mt-5 flex gap-2 max-w-lg'>
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder='New category name' className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                <button onClick={addCategory} className='px-4 py-2.5 rounded-lg bg-slate-800 text-white'><Plus size={16} /></button>
            </div>

            <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl'>
                {categories.map((category) => (
                    <div key={category.id} className='rounded-xl border border-slate-200 bg-white p-4'>
                        <div className='flex items-center justify-between'>
                            <h2 className='font-semibold text-slate-800'>{category.name}</h2>
                            <button onClick={() => removeCategory(category.id)} className='p-2 rounded-md text-red-600 hover:bg-red-50'><Trash2 size={16} /></button>
                        </div>

                        <div className='mt-3 flex flex-wrap gap-2'>
                            {category.subcategories.map((sub) => (
                                <span key={sub} className='inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700'>
                                    {sub}
                                    <button onClick={() => removeSubcategory(category.id, sub)} className='text-red-600'>×</button>
                                </span>
                            ))}
                        </div>

                        <div className='mt-3 flex gap-2'>
                            <input
                                value={subcatInput[category.id] || ''}
                                onChange={(event) => setSubcatInput((prev) => ({ ...prev, [category.id]: event.target.value }))}
                                placeholder='Add subcategory'
                                className='w-full border border-slate-300 rounded-lg px-3 py-2 outline-none text-sm'
                            />
                            <button onClick={() => addSubcategory(category.id)} className='px-3 rounded-lg bg-slate-100 text-slate-700'>Add</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
