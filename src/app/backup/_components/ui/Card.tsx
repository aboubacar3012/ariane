import React, { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

/**
 * Composant Card réutilisable pour encapsuler du contenu dans un design cohérent
 */
const Card = ({ title, children, icon }: CardProps) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <div className="p-4 bg-gray-750 border-b border-gray-700">
        <h2 className="text-lg font-semibold flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;