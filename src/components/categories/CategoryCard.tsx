import { Category } from '@/types';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import Image from '@/components/ui/Image';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = memo(({ category }: CategoryCardProps) => (
  <Link to={`/?category=${category.id}`} className="block group">
    <div className="relative rounded-lg shadow-md overflow-hidden h-64 bg-gray-200 dark:bg-gray-700">
      {/* Full Image Background */}
      <Image
        src={category.image}
        alt={category.name}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />

      {/* Category Name in Bottom Right Corner */}
      <div className="absolute bottom-4 right-4">
        <h3 className="text-lg font-bold text-white drop-shadow-lg">
          {category.name}
        </h3>
      </div>
    </div>
  </Link>
));

export default CategoryCard;
