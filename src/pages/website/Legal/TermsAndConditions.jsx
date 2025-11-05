import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="h1 mb-2">शर्तें और शर्तें</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">अंतिम अपडेट: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          {/* Acceptance */}
          <section>
            <h2 className="h3 mb-4">स्वीकृति</h2>
            <p className="text-base leading-relaxed">
              इस वेबसाइट को एक्सेस करके और हमारे कोर्सों के लिए रजिस्ट्रेशन करके, आप इन सभी शर्तों को स्वीकार करते हैं। अगर आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।
            </p>
          </section>

          {/* Course Eligibility */}
          <section>
            <h2 className="h3 mb-4">कोर्स के लिए योग्यता</h2>
            <p className="text-base leading-relaxed mb-4">
              हमारे सभी कोर्सों में शामिल होने के लिए आपको निम्नलिखित शर्तों को पूरा करना होगा:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>आपकी उम्र कम से कम 18 साल होनी चाहिए</li>
              <li>आपको न्यूनतम 8वीं पास होना चाहिए</li>
              <li>आपके पास वैध सरकारी आईडी प्रूफ होना चाहिए</li>
              <li>आपको शारीरिक रूप से फिट होना चाहिए (कोर्स मांग वाला होता है)</li>
            </ul>
          </section>

          {/* Course Fees and Payment */}
          <section>
            <h2 className="h3 mb-4">कोर्स शुल्क और भुगतान</h2>
            <p className="text-base leading-relaxed mb-4">
              कोर्स शुल्क इस प्रकार हैं:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 space-y-2 text-sm">
              <p><strong>JCB (Backhoe Loader) ट्रेनिंग:</strong> ₹29,000 (रूम और भोजन सहित) / ₹25,000 (बिना रूम और भोजन)</p>
              <p><strong>एक्सकेवेटर ऑपरेटर ट्रेनिंग:</strong> ₹29,000 (रूम और भोजन सहित) / ₹25,000 (बिना रूम और भोजन)</p>
              <p><strong>लोडर ऑपरेटर ट्रेनिंग:</strong> ₹29,000 (रूम और भोजन सहित) / ₹25,000 (बिना रूम और भोजन)</p>
              <p><strong>डोजर ऑपरेटर ट्रेनिंग:</strong> ₹24,000 (रूम और भोजन सहित) / ₹20,000 (बिना रूम और भोजन)</p>
              <p><strong>ग्रेडर ऑपरेटर ट्रेनिंग:</strong> ₹24,000 (रूम और भोजन सहित) / ₹20,000 (बिना रूम और भोजन)</p>
            </div>
            <p className="text-base leading-relaxed mb-4">
              सभी कोर्स 1 महीने की अवधि के हैं और कार प्रशिक्षण मुफ्त है।
            </p>
            <p className="text-base leading-relaxed">
              भुगतान रजिस्ट्रेशन के समय करना आवश्यक है। हम नकद, बैंक ट्रांसफर और ऑनलाइन भुगतान स्वीकार करते हैं। एक बार भुगतान कर दिए जाने के बाद, वह वापस नहीं किया जाएगा।
            </p>
          </section>

          {/* Cancellation Policy */}
          <section>
            <h2 className="h3 mb-4">रद्दीकरण नीति</h2>
            <p className="text-base leading-relaxed mb-4">
              यदि आप कोर्स शुरू होने से 7 दिन पहले कोर्स को रद्द करना चाहते हैं, तो:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
              <li>आपको 50% रिफंड दिया जाएगा</li>
              <li>बाकी 50% प्रशासनिक शुल्क के रूप में रखा जाएगा</li>
            </ul>
            <p className="text-base leading-relaxed">
              अगर आप कोर्स शुरू होने के बाद रद्दीकरण के लिए कहते हैं, तो कोई रिफंड नहीं दिया जाएगा।
            </p>
          </section>

          {/* Attendance and Completion */}
          <section>
            <h2 className="h3 mb-4">उपस्थिति और प्रमाण पत्र</h2>
            <p className="text-base leading-relaxed mb-4">
              प्रमाण पत्र प्राप्त करने के लिए:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>आपको कम से कम 80% कक्षाओं में उपस्थित होना चाहिए</li>
              <li>आपको सभी प्रैक्टिकल परीक्षाओं में शामिल होना चाहिए</li>
              <li>आपको न्यूनतम अंक प्राप्त करने चाहिए</li>
            </ul>
          </section>

          {/* Code of Conduct */}
          <section>
            <h2 className="h3 mb-4">आचरण नियम</h2>
            <p className="text-base leading-relaxed mb-4">
              हमारे सभी छात्रों को निम्नलिखित नियमों का पालन करना चाहिए:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>शराब, सिगरेट और ड्रग्स का कोई भी उपयोग वर्जित है</li>
              <li>प्रशिक्षकों और स्टाफ के साथ सम्मानपूर्वक व्यवहार करें</li>
              <li>प्रशिक्षण केंद्र में सुरक्षा नियमों का पालन करें</li>
              <li>समय पर आएं और अनुशासित रहें</li>
              <li>किसी को परेशान करने या धमकाने वाले व्यवहार को स्वीकार नहीं किया जाएगा</li>
            </ul>
          </section>

          {/* Safety and Liability */}
          <section>
            <h2 className="h3 mb-4">सुरक्षा और जिम्मेदारी</h2>
            <p className="text-base leading-relaxed mb-4">
              भारी मशीनरी प्रशिक्षण खतरनाक हो सकता है। छात्रों को यह समझना चाहिए कि:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>प्रशिक्षण केंद्र में सभी सुरक्षा उपकरण का सही तरीके से उपयोग करें</li>
              <li>प्रशिक्षकों की सभी सुरक्षा हिदायतों का पालन करें</li>
              <li>दुर्घटना के लिए Earth Movers Training Academy जिम्मेदार नहीं है अगर आप सुरक्षा नियमों का पालन नहीं करते</li>
              <li>हम आपको दुर्घटना बीमा लेने की सलाह देते हैं</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="h3 mb-4">कोर्स सामग्री</h2>
            <p className="text-base leading-relaxed">
              सभी कोर्स सामग्री, व्याख्यान नोट्स, और प्रशिक्षण सामग्री Earth Movers Training Academy की संपत्ति है। आप इसे सिर्फ व्यक्तिगत उपयोग के लिए कॉपी कर सकते हैं। किसी को भी इसे बिना अनुमति के बेचने, साझा करने या प्रकाशित करने की अनुमति नहीं है।
            </p>
          </section>

          {/* Modification of Terms */}
          <section>
            <h2 className="h3 mb-4">शर्तों में बदलाव</h2>
            <p className="text-base leading-relaxed">
              हम किसी भी समय इन शर्तों को बदल सकते हैं। अगर हम महत्वपूर्ण बदलाव करते हैं, तो हम आपको ईमेल से सूचित करेंगे।
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="h3 mb-4">जिम्मेदारी की सीमा</h2>
            <p className="text-base leading-relaxed">
              हमारी वेबसाइट और सेवाएं "जैसा है" आधार पर प्रदान की जाती हैं। हम किसी भी नुकसान के लिए जिम्मेदार नहीं हैं जो आपकी सेवाओं के उपयोग से हो सकता है, जब तक कि यह हमारे स्पष्ट गलती के कारण न हो।
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="h3 mb-4">हमसे संपर्क करें</h2>
            <p className="text-base leading-relaxed mb-4">
              इन शर्तों के बारे में सवाल हैं? हमसे संपर्क करें:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold mb-2">Earth Movers Training Academy</p>
              <p>फोन: +91 9175113022</p>
              <p>ईमेल: shahabuddintraining@gmail.com</p>
              <p>पता: Beside NH-2 At Barkatha, Barhi, Hazaribagh, Jharkhand (825323)</p>
            </div>
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
  );
};

export default TermsAndConditions;
