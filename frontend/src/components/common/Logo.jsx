import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-3 p-1.5 pr-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ rotate: -90, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/40 shrink-0 flex items-center justify-center"
      >
        <img
          src="/svgviewer-output.svg"
          alt="Logo"
          className="w-6 h-6 object-contain"
        />
      </motion.div>

      {/* Animated Text */}
      <div className="flex flex-col leading-tight">
        <motion.span
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white font-bold text-lg tracking-wide uppercase"
        >
          RangManch
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6 }}
          className="text-blue-400 text-[10px] font-medium tracking-[0.2em] uppercase"
        >
          Streaming Now
        </motion.span>
      </div>

      {/* Shimmer Effect Overlay */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
      />
    </motion.div>
  );
};

export default Logo;
