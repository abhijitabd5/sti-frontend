import facebookIcon from "@/assets/icons/facebook.png";
import instagramIcon from "@/assets/icons/instagram.png";
import youtubeIcon from "@/assets/icons/youtube.png";

function FloatingSocialButtons() {
  return (
    <div className="space-y-3">
      {/* Facebook Button */}
      <a
        href="https://facebook.com/share/14vkpKdoPz/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-white hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Facebook"
      >
        <img
          src={facebookIcon}
          alt="Facebook"
          className="w-10 h-10"
        />
      </a>

      {/* Instagram Button */}
      <a
        href="https://instagram.com/shahabuddin_training_institute/?igsh=MWp6NXZ3cndlbzk1OQ%3D%3D&utm_source=qr#" 
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-white hover:bg-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Instagram"
      >
        <img
          src={instagramIcon}
          alt="Instagram"
          className="w-10 h-10"
        />
      </a>

      {/* YouTube Button */}
      <a
        href="https://youtube.com/@shahabuddinshajahan9112"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-white hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="YouTube"
      >
        <img
          src={youtubeIcon}
          alt="YouTube"
          className="w-10 h-10"
        />
      </a>
    </div>
  );
}

export default FloatingSocialButtons;
