import { useState } from "react";

const FAQItem = ({ question, answer }) => (
  <div className="border-dotted-thick border-[#1877F2] p-6 bg-white">
    <h3 className="text-lg font-bold mb-2 text-[#1877F2] uppercase tracking-tight">
      {question}
    </h3>
    <p className="text-gray-600 leading-relaxed">{answer}</p>
  </div>
);

const FeatureCard = ({ title, desc, icon }) => (
  <div className="border-dotted-thick border-[#1877F2] p-8 hover:bg-blue-50 transition-colors">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-black mb-2 uppercase text-[#1877F2]">
      {title}
    </h3>
    <p className="text-gray-600 text-sm font-medium">{desc}</p>
  </div>
);

export default function App() {
  const [downloading, setDownloading] = useState(false);
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatStat = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  const handleDownload = async (imageUrl, username) => {
    setDownloading(true);
    try {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
        imageUrl
      )}&output=jpg`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}_instagram_dp.jpg`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(imageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleSearch = async () => {
    if (!input) return;
    setLoading(true);
    setData(null);

    try {
      let username = input
        .trim()
        .split("/")
        .filter(Boolean)
        .pop()
        .split("?")[0]
        .replace("@", "");

      const response = await fetch(
        "https://instagram120.p.rapidapi.com/api/instagram/userInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": import.meta.env.VITE_RAPIDAPI_HOST,
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
          },
          body: JSON.stringify({ username: username }),
        }
      );

      const res = await response.json();
      const user = res.result[0].user;

      if (user) {
        setData({
          name: user.full_name,
          username: user.username,
          originalImage: user.hd_profile_pic_url_info.url,
          displayImage: `https://images.weserv.nl/?url=${encodeURIComponent(
            user.hd_profile_pic_url_info.url
          )}`,
          bio: user.biography,
          followers: user.follower_count,
          following: user.following_count,
          posts: user.media_count,
          isVerified: user.is_verified,
        });
      } else {
        throw new Error("User not found");
      }
    } catch (e) {
      alert("Error: User not found or API limit reached.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html { scroll-behavior: smooth; }
        .border-dotted-thick { border-style: dotted; border-width: 2px; }
      `,
        }}
      />

      <nav className="border-b-2 border-dotted border-[#1877F2] py-6 px-6 md:px-24 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="text-2xl font-black tracking-tighter text-[#1877F2]">
          INSTA<span className="bg-[#1877F2] text-white px-1 ml-1">DP</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#1877F2]">
          <a href="#features" className="hover:underline">
            Features
          </a>
          <a href="#how-to" className="hover:underline">
            Guide
          </a>
          <a href="#faq" className="hover:underline">
            FAQ
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-[#1877F2] uppercase">
            Insta Profile <br /> Downloader
          </h1>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto border-l-4 border-[#1877F2] pl-4">
            Download any Instagram profile picture in full size HD quality.
            Safe, fast, and completely anonymous.
          </p>
        </div>

        <div className="max-w-3xl mx-auto border-2 border-dotted border-[#1877F2] p-3 flex flex-col md:flex-row gap-3 bg-white">
          <input
            type="text"
            placeholder="Enter Username or Profile URL..."
            className="flex-1 bg-blue-50 px-6 py-4 outline-none text-[#1877F2] font-bold placeholder:text-blue-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#1877F2] hover:bg-blue-700 text-white font-black px-10 py-4 transition-all uppercase tracking-tighter disabled:opacity-50"
          >
            {loading ? "Fetching..." : "Get Image"}
          </button>
        </div>

        {data && (
          <div className="mt-16 border-2 border-dotted border-[#1877F2] max-w-md mx-auto p-6 bg-white shadow-2xl">
            <div className="border-2 border-[#1877F2] mb-6 bg-gray-100 aspect-square flex items-center justify-center overflow-hidden rounded-xl">
              <img
                src={data.displayImage}
                alt="Profile Preview"
                className="w-full h-full rounded-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-black text-[#1877F2] uppercase tracking-tighter flex items-center gap-2">
                  {data.name}
                  {data.isVerified && (
                    <span className="text-blue-500 text-sm">✓</span>
                  )}
                </h2>
                <p className="text-gray-400 font-bold italic">
                  @{data.username}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-y-2 border-dotted border-blue-100 py-4 mb-4 text-center">
              <div>
                <div className="font-black text-[#1877F2]">
                  {formatStat(data.posts)}
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400">
                  Posts
                </div>
              </div>
              <div>
                <div className="font-black text-[#1877F2]">
                  {formatStat(data.followers)}
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400">
                  Followers
                </div>
              </div>
              <div>
                <div className="font-black text-[#1877F2]">
                  {formatStat(data.following)}
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400">
                  Following
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-tight min-h-[1.25rem]">
              {data.bio}
            </p>

            <button
              onClick={() => handleDownload(data.originalImage, data.username)}
              disabled={downloading}
              className="block w-full text-center bg-[#1877F2] text-white py-4 font-black uppercase tracking-widest hover:bg-blue-800 transition-colors"
            >
              {downloading ? "Downloading..." : "Download HD Profile"}
            </button>
          </div>
        )}

        <section id="features" className="mt-40">
          <h2 className="text-3xl font-black mb-10 text-[#1877F2] uppercase italic">
            / / Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="📷"
              title="Original Quality"
              desc="We fetch the highest resolution available directly from the source servers."
            />
            <FeatureCard
              icon="🔒"
              title="Private & Secure"
              desc="No login required. We don't store any user data or search history."
            />
            <FeatureCard
              icon="⚡"
              title="Instant Save"
              desc="Our processing engine ensures you get the download link in under 2 seconds."
            />
          </div>
        </section>

        <section
          id="how-to"
          className="mt-32 bg-blue-50 border-2 border-dotted border-[#1877F2] p-10"
        >
          <h2 className="text-3xl font-black mb-8 text-[#1877F2]">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="text-5xl font-black text-blue-200 mb-4">01</div>
              <p className="font-bold text-gray-700">
                Copy the profile link from the Instagram app or website.
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-blue-200 mb-4">02</div>
              <p className="font-bold text-gray-700">
                Paste the link into the search box above.
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-blue-200 mb-4">03</div>
              <p className="font-bold text-gray-700">
                Hit "Get Image" and save the HD file to your gallery.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="mt-32 mb-20">
          <h2 className="text-3xl font-black mb-10 text-[#1877F2] uppercase italic">
            / / FAQ
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FAQItem
              question="Does it work on Mobile?"
              answer="Yes! It's fully responsive and works on Chrome, Safari, and other mobile browsers."
            />
            <FAQItem
              question="Can I download Private DPs?"
              answer="Due to security policies, only profile pictures of public accounts are accessible via the API."
            />
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-dotted border-[#1877F2] py-16 px-6 text-center">
        <div className="text-xl font-black text-[#1877F2] mb-4 uppercase">
          INSTA DP
        </div>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
          Not affiliated with Instagram or Meta Platforms, Inc.
        </p>
      </footer>
    </div>
  );
}
