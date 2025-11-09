import React from "react";
import { Link } from "react-router-dom";
import WebsiteLayout from "@/components/common/Layouts/WebsiteLayout";

const PrivacyPolicy = () => {
  return (
    <WebsiteLayout className="pt-16 lg:pt-20">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="h1 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            {/* Introduction */}
            <section>
              <h2 className="h3 mb-4">हमारे बारे में</h2>
              <p className="text-base leading-relaxed">
                Earth Movers Training Academy में आपका स्वागत है। हम एक छोटा,
                विश्वस्त प्रशिक्षण संस्थान हैं जो भारी मशीनरी ऑपरेटर्स को
                प्रशिक्षण देते हैं। हम आपकी निजी जानकारी को सुरक्षित रखने के लिए
                प्रतिबद्ध हैं।
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="h3 mb-4">हम कौन सी जानकारी इकट्ठा करते हैं</h2>
              <p className="text-base leading-relaxed mb-4">
                जब आप हमारे साथ कोर्स के लिए रजिस्ट्रेशन करते हैं, तो हम
                निम्नलिखित जानकारी ले सकते हैं:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>आपका पूरा नाम और पता</li>
                <li>फोन नंबर और ईमेल एड्रेस</li>
                <li>आधार नंबर या अन्य आईडी प्रूफ</li>
                <li>शिक्षा योग्यता की जानकारी</li>
                <li>भुगतान से संबंधित विवरण</li>
                <li>आपके कोर्स की प्रगति और प्रदर्शन रिकॉर्ड</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="h3 mb-4">
                हम आपकी जानकारी का उपयोग कैसे करते हैं
              </h2>
              <p className="text-base leading-relaxed mb-4">
                हम आपकी जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>आपके कोर्स रजिस्ट्रेशन को प्रोसेस करने के लिए</li>
                <li>आपको कोर्स शेड्यूल और अपडेट भेजने के लिए</li>
                <li>भुगतान और शुल्क का रिकॉर्ड रखने के लिए</li>
                <li>प्रमाण पत्र जारी करने के लिए</li>
                <li>सेवा में सुधार के लिए फीडबैक लेने के लिए</li>
                <li>कानूनी दायित्वों को पूरा करने के लिए</li>
              </ul>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="h3 mb-4">आपकी जानकारी की सुरक्षा</h2>
              <p className="text-base leading-relaxed">
                हम आपकी व्यक्तिगत जानकारी को सुरक्षित रखने के लिए उचित कदम उठाते
                हैं। आपकी जानकारी केवल जरूरत के समय ही अन्य लोगों के साथ साझा की
                जाती है, जैसे परीक्षा बोर्ड या सरकारी विभाग। हम आपकी जानकारी को
                कभी भी बिना आपकी अनुमति के बेचते नहीं हैं।
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="h3 mb-4">वेबसाइट पर ट्रैकिंग</h2>
              <p className="text-base leading-relaxed">
                हमारी वेबसाइट आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग
                कर सकती है। कुकीज़ छोटी फाइलें होती हैं जो आपके ब्राउज़र में सेव
                होती हैं और हमें यह समझने में मदद करती हैं कि आप हमारी वेबसाइट
                का उपयोग कैसे करते हैं।
              </p>
            </section>

            {/* Third Party Links */}
            <section>
              <h2 className="h3 mb-4">बाहरी लिंक्स</h2>
              <p className="text-base leading-relaxed">
                हमारी वेबसाइट में अन्य वेबसाइटों के लिंक हो सकते हैं। हम उन
                वेबसाइटों की गोपनीयता नीति के लिए जिम्मेदार नहीं हैं। कृपया जब
                आप किसी बाहरी वेबसाइट पर जाएं तो उनकी गोपनीयता नीति को जांचें।
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="h3 mb-4">आपके अधिकार</h2>
              <p className="text-base leading-relaxed mb-4">
                आपको निम्नलिखित अधिकार हैं:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>हमसे यह पूछ सकते हैं कि हम आपके बारे में क्या जानते हैं</li>
                <li>गलत जानकारी को सुधारने के लिए कह सकते हैं</li>
                <li>
                  अपनी जानकारी को हटाने के लिए कह सकते हैं (कुछ कानूनी सीमाओं के
                  साथ)
                </li>
              </ul>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="h3 mb-4">हमसे संपर्क करें</h2>
              <p className="text-base leading-relaxed mb-4">
                अगर आपको इस गोपनीयता नीति के बारे में कोई सवाल है, तो हमसे
                संपर्क करें:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold mb-2">
                  Earth Movers Training Academy
                </p>
                <p>फोन: +91 9175113022</p>
                <p>ईमेल: shahabuddintraining@gmail.com</p>
                <p>
                  पता: Beside NH-2 At Barkatha, Barhi, Hazaribagh, Jharkhand
                  (825323)
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="h3 mb-4">नीति में बदलाव</h2>
              <p className="text-base leading-relaxed">
                हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। बड़े
                बदलावों के बारे में हम आपको ईमेल से सूचित करेंगे।
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/"
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium"
            >
              ← वापस होम पेज
            </Link>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default PrivacyPolicy;
