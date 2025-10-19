function FloatingSocialButtons() {
  return (
    <div className="space-y-3">
      {/* Facebook Button */}
      <a
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-white hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Facebook"
      >
        <img
          src="/src/assets/icons/facebook.png"
          alt="Facebook"
          className="w-10 h-10"
        />
      </a>

      {/* Instagram Button */}
      <a
        href="https://www.instagram.com" 
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-white hover:bg-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Instagram"
      >
        <img
          src="/src/assets/icons/instagram.png"
          alt="Instagram"
          className="w-10 h-10"
        />
      </a>

      {/* YouTube Button */}
      <a
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-white hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="YouTube"
      >
        <img
          src="/src/assets/icons/youtube.png"
          alt="YouTube"
          className="w-10 h-10"
        />
      </a>
    </div>
  );
}

export default FloatingSocialButtons;
