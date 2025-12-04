import { useAuth } from "../context/useAuth";

const Socials = () => {
  const { userData } = useAuth();
  const socialPlatforms = [
    {
      name: "WhatsApp",
      icon: "fa-brands fa-whatsapp",
      color: "#25D366",
      url: (text, url) =>
        `https://wa.me/?text=${encodeURIComponent(text + url)}`,
    },
    {
      name: "Twitter",
      icon: "fa-brands fa-twitter",
      color: "#1DA1F2",
      url: (text, url) =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text + url
        )}`,
    },
    {
      name: "Facebook",
      icon: "fa-brands fa-facebook-f",
      color: "#1877F2",
      url: (text, url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}&quote=${encodeURIComponent(text)}`,
    },
    {
      name: "Telegram",
      icon: "fa-brands fa-telegram",
      color: "#0088CC",
      url: (text, url) =>
        `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`,
    },
    {
      name: "Reddit",
      icon: "fa-brands fa-reddit",
      color: "#FF4500",
      url: (text, url) =>
        `https://reddit.com/submit?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(text)}`,
    },
  ];

  const userLink = () => {
    const baseURL = window.location.origin;
    const whisperID = userData?.whisperId;
    return `${baseURL}/u/${whisperID}`;
  };

  const shareText = "Send me an anonymous message on WhisperIn ";
  const shareUrl = userLink();

  return (
    <>
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url(shareText, shareUrl)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: platform.color }}
          title={`Share on ${platform.name}`}
        >
          <i className={`f-16 hover-exp ${platform.icon}`}></i>
        </a>
      ))}
    </>
  );
};

export default Socials;
