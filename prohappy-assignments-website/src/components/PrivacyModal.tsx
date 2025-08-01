import React from 'react';
import Modal from './Modal';
import { useAppContext } from '../contexts/AppContext';

const PrivacyModal: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleClose = () => {
    dispatch({ type: 'SET_SHOW_PRIVACY', payload: false });
  };

  return (
    <Modal
      isOpen={state.showPrivacy}
      onClose={handleClose}
      title="Privacy Policy"
      maxWidth="2xl"
    >
      <div className="prose prose-sm max-w-none text-[#434343]">
        <p className="text-sm text-gray-600 mb-4">
          <strong>Last Updated:</strong> January 2025
        </p>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">1. Introduction</h3>
          <p className="mb-3">
            ProHappyAssignments ("we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          <p className="mb-3">
            This policy complies with applicable data protection laws, including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other relevant privacy regulations as of 2025.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">2. Information We Collect</h3>
          
          <h4 className="font-semibold text-[#2f3b65] mb-2">Personal Information</h4>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>Full name and email address</li>
            <li>Academic information (module names, assignment details)</li>
            <li>Communication preferences</li>
            <li>Files and documents you upload</li>
          </ul>

          <h4 className="font-semibold text-[#2f3b65] mb-2">Technical Information</h4>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Usage data and website interactions</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">3. How We Use Your Information</h3>
          <p className="mb-3">We use your personal information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>To provide and improve our academic assistance services</li>
            <li>To communicate with you about your assignments and requests</li>
            <li>To process payments and manage your account</li>
            <li>To ensure service quality and customer support</li>
            <li>To comply with legal obligations and protect our rights</li>
            <li>To analyze website usage and improve user experience</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">4. Legal Basis for Processing (GDPR)</h3>
          <p className="mb-3">We process your personal data based on:</p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li><strong>Contract:</strong> To fulfill our service agreement with you</li>
            <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
            <li><strong>Consent:</strong> For marketing communications and cookies (where required)</li>
            <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">5. Information Sharing and Disclosure</h3>
          <p className="mb-3">We may share your information with:</p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li><strong>Academic Professionals:</strong> To provide the requested services</li>
            <li><strong>Service Providers:</strong> Third-party vendors who assist in our operations</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
          </ul>
          <p className="mb-3">
            We do not sell, rent, or trade your personal information to third parties for marketing purposes.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">6. Data Security</h3>
          <p className="mb-3">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication measures</li>
            <li>Staff training on data protection practices</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">7. Data Retention</h3>
          <p className="mb-3">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Typically, we retain:
          </p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>Account information: Until account deletion or 3 years of inactivity</li>
            <li>Assignment data: 2 years after service completion</li>
            <li>Communication records: 1 year after last interaction</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">8. Your Rights</h3>
          <p className="mb-3">Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li><strong>Access:</strong> Request information about your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Restriction:</strong> Limit how we process your data</li>
            <li><strong>Objection:</strong> Object to certain types of processing</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">9. Cookies and Tracking</h3>
          <p className="mb-3">
            We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can manage your cookie preferences through your browser settings or our cookie consent banner.
          </p>
          <p className="mb-3">
            Essential cookies are necessary for website functionality and cannot be disabled. Optional cookies require your consent and can be managed through your preferences.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">10. International Data Transfers</h3>
          <p className="mb-3">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including adequacy decisions, standard contractual clauses, or other approved mechanisms.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">11. Children's Privacy</h3>
          <p className="mb-3">
            Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware of such collection, we will take steps to delete the information promptly.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">12. Changes to This Policy</h3>
          <p className="mb-3">
            We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. We will notify you of material changes through our website or direct communication.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">13. Contact Us</h3>
          <p className="mb-3">
            If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>Through our website contact form</li>
            <li>Email: privacy@prohappyassignments.com</li>
            <li>For EU residents: You may also contact your local data protection authority</li>
          </ul>
        </section>
      </div>
    </Modal>
  );
};

export default PrivacyModal;