import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-10 md:mb-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-film-black-900 dark:text-white">
        {title.split(' & ')[0]} <span className="text-film-red-600">&</span> {title.split(' & ')[1]}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
