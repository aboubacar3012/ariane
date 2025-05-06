import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  children: React.ReactNode;
  showClose?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  children,
  showClose = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Appliquer la classe CSS en fonction de la taille
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-11/12 max-w-md';
      case 'medium':
        return 'w-11/12 max-w-2xl';
      case 'large':
        return 'w-11/12 max-w-4xl';
      case 'full':
        return 'w-11/12 max-w-7xl';
      default:
        return 'w-11/12 max-w-2xl';
    }
  };

  // Gérer la fermeture par la touche Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Gérer la fermeture en cliquant en dehors du modal
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 10 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 },
    },
  };

  const childrenVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] grid place-items-center bg-black/30 backdrop-blur-md"
          onClick={handleOutsideClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          style={{ 
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        >
          <motion.div
            ref={modalRef}
            className={`${getSizeClass()} overflow-auto rounded-lg bg-gray-800 font-sans text-base font-light leading-relaxed text-white antialiased shadow-2xl border border-gray-700`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Entête du modal avec titre et bouton fermer */}
            {(title || showClose) && (
              <motion.div
                className="flex items-center justify-between px-6 py-4 border-b border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {title && (
                  <motion.h3
                    className="text-xl font-semibold text-white"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 500 }}
                  >
                    {title}
                  </motion.h3>
                )}
                {showClose && (
                  <motion.button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white focus:outline-none"
                    aria-label="Fermer"
                    whileHover={{
                      rotate: 90,
                      scale: 1.1,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Corps du modal */}
            <motion.div
              className="p-6"
              variants={childrenVariants}
              initial="hidden"
              animate="visible"
            >
              {children}
            </motion.div>

            {/* Pied du modal optionnel */}
            {footer && (
              <motion.div
                className="border-t border-gray-700 px-6 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {React.Children.map(footer, child => {
                  if (React.isValidElement(child)) {
                    return (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {React.cloneElement(child)}
                      </motion.div>
                    );
                  }
                  return child;
                })}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;