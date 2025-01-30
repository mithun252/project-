import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../Header/Header';
import './style.css';

const MenuHeader = () => {
    const history = useHistory();

    const categories = [
        { name: 'Cars', path: '/category/Cars' },
        { name: 'Motorcycles', path: '/category/Motorcycles' },
        { name: 'Mobile Phones', path: '/category/Mobile-Phones' },
        { name: 'Houses & Apartments', path: '/category/Houses-Apartments' },
        { name: 'Scooters', path: '/category/Scooters' },
        { name: 'Commercial Vehicles', path: '/category/Commercial-Vehicles' }
    ];

    const handleCategoryClick = (path) => {
        history.push(path);
    };

    return (
        <>
            <Header/>
            <div className="menuheader">
                <div className="mainheader">
                    <div className="categories">
                        <div className="allcategoriesbox">
                            <span>ALL CATEGORIES</span>
                        </div>
                        <div className="allcategories">
                            {categories.map((category, index) => (
                                <a 
                                    key={index}
                                    href="#"
                                    className="allcategories_list"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCategoryClick(category.path);
                                    }}
                                >
                                    <span>{category.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>     
            </div>
        </>
    );
};

export default MenuHeader;
