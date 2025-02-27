import React, { useEffect, useState } from "react";

interface WithRevealAnimationProps {
  id: string;
  className?: string;
}

const withRevealAnimation = <P extends object>(
  Component: React.ComponentType<P>,
  options = { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
) => {
  return function WithRevealAnimation(
    { id, className, ...props }: P & WithRevealAnimationProps,
  ) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined" && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsVisible(entry.isIntersecting);
          },
          options,
        );

        const element = document.getElementById(id);
        if (element) observer.observe(element);

        return () => {
          if (element) observer.unobserve(element);
        };
      }
    }, [id]);

    const revealClass = isVisible
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out";

    return (
      <div id={id} className={`${revealClass} ${className || ""}`}>
        <Component {...(props as P)} />
      </div>
    );
  };
};

export default withRevealAnimation;
