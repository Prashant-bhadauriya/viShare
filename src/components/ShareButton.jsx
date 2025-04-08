import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
} from "react-share";
import {
  FaFacebook,
  FaXTwitter,
  FaWhatsapp,
  FaRedditAlien,
  FaLink,
} from "react-icons/fa6";
import { toast } from "react-hot-toast";

const ShareButton = ({ url }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("🔗 Link copied!", {
      style: {
        borderRadius: "8px",
        background: "#333",
        color: "#fff",
        padding: "10px 16px",
      },
      icon: "📎",
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Facebook */}
      <FacebookShareButton url={url}>
        <div
          className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm shadow"
          title="Share on Facebook"
        >
          <FaFacebook />
        </div>
      </FacebookShareButton>

      {/* X / Twitter */}
      <TwitterShareButton url={url}>
        <div
          className="flex items-center justify-center px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm shadow"
          title="Share on X"
        >
          <FaXTwitter />
        </div>
      </TwitterShareButton>

      {/* WhatsApp */}
      <WhatsappShareButton url={url}>
        <div
          className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm shadow"
          title="Share on WhatsApp"
        >
          <FaWhatsapp />
        </div>
      </WhatsappShareButton>

      {/* Reddit */}
      <RedditShareButton url={url}>
        <div
          className="flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm shadow"
          title="Share on Reddit"
        >
          <FaRedditAlien />
        </div>
      </RedditShareButton>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center px-3 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition text-sm shadow"
        title="Copy Link"
      >
        <FaLink />
      </button>
    </div>
  );
};

export default ShareButton;
