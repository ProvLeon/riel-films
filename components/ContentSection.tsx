import React from "react";

interface ContentSectionProps {
  title?: string;
  content: string[];
  className?: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  content,
  className = "",
}) => {
  return (
    <section
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 ${className}`}
    >
      {title && (
        <h2 className="text-4xl md:text-5xl font-medium text-film-black-900 dark:text-white mb-8">
          {title}
        </h2>
      )}

      <div className="prose prose-lg max-w-3xl dark:prose-invert text-film-black-900 dark:text-white">
        {content.map((paragraph, index) => (
          <p
            key={index}
            className={`${index > 0 ? "mt-6" : ""} text-lg leading-relaxed`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
};

export default ContentSection;
