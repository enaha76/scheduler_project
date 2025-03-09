import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-supnum-blue to-supnum-teal flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="flex space-x-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-4 h-4 bg-white rounded-full"
              animate={{
                y: [0, -10, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
        <motion.img
          src="/supnum.png"
          alt="SupNum"
          className="h-16 w-auto mx-auto mb-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.p
          className="text-white text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Chargement...
        </motion.p>
      </div>
    </div>
  );
} 