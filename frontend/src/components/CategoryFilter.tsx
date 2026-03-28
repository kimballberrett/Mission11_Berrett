import { useEffect, useState } from 'react';

// Sidebar filter that fetches available book categories and renders checkboxes.
function CategoryFilter({
    selectedCategories,
    setSelectedCategories,
}: {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}) {
    const [categories, setCategories] = useState<string[]>([]);

    // Fetch the distinct category list from the API once on mount.
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    'http://localhost:4000/Book/GetBookCategories'
                );
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };
        fetchCategories();
    }, []);

    const handleCheckboxChange = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <div>
            <h5>Filter by Category</h5>
            {categories.map((c) => (
                <div key={c} className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={c}
                        checked={selectedCategories.includes(c)}
                        onChange={() => handleCheckboxChange(c)}
                    />
                    <label className="form-check-label" htmlFor={c}>
                        {c}
                    </label>
                </div>
            ))}
        </div>
    );
}

export default CategoryFilter;
