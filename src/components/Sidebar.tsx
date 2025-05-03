import { GitPullRequest, Github } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
    const [isGithubOpen, setIsGithubOpen] = useState(false);

    return (
        <motion.aside 
            className="w-64 bg-gray-800 p-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <motion.h1 
                className="text-xl font-bold mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Ariane
            </motion.h1>
            <nav>
                <ul className="space-y-4">
                    {/* <motion.li 
                        className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Home className="w-5 h-5" />
                        <span>Home</span>
                    </motion.li> */}
                    <motion.li
                        layout
                    >
                        <motion.div 
                            className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded"
                            onClick={() => setIsGithubOpen(!isGithubOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                        </motion.div>
                        <AnimatePresence>
                            {isGithubOpen && (
                                <motion.ul 
                                    className="pl-7 mt-2 space-y-2"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.li 
                                        className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <GitPullRequest className="w-4 h-4" />
                                        <span>Pull Requests</span>
                                    </motion.li>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.li>
                </ul>
            </nav>
        </motion.aside>
    );
}

export default Sidebar;