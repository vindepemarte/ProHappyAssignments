import React from 'react';
import Modal from './Modal';
import { useAppContext } from '../contexts/AppContext';

const TermsModal: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleClose = () => {
    dispatch({ type: 'SET_SHOW_TERMS', payload: false });
  };

  return (
    <Modal
      isOpen={state.showTerms}
      onClose={handleClose}
      title="Terms and Conditions"
      maxWidth="2xl"
    >
      <div className="prose prose-sm max-w-none text-[#434343]">
        <p className="text-sm text-gray-600 mb-4">
          <strong>Last Updated:</strong> January 2025
        </p>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">1. Acceptance of Terms</h3>
          <p className="mb-3">
            By accessing and using the ProHappyAssignments website ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">2. Service Description</h3>
          <p className="mb-3">
            ProHappyAssignments provides academic assistance services through our online platform. We connect students with qualified academic professionals to help with assignments, research, and educational support.
          </p>
          <p className="mb-3">
            Our services are intended for educational support and reference purposes only. All work provided should be used as a guide and reference for your own academic work.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">3. User Responsibilities</h3>
          <ul className="list-disc pl-6 mb-3 space-y-2">
            <li>You must provide accurate and complete information when using our services</li>
            <li>You are responsible for maintaining the confidentiality of your access codes</li>
            <li>You agree to use our services in compliance with all applicable laws and regulations</li>
            <li>You will not use our services for any unlawful or prohibited activities</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">4. Academic Integrity</h3>
          <p className="mb-3">
            We strongly encourage academic integrity. Our services are designed to provide educational support and guidance. Users are responsible for ensuring their use of our services complies with their institution's academic policies.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">5. Payment and Refunds</h3>
          <p className="mb-3">
            Payment terms and refund policies will be communicated separately for each service request. All payments are processed securely through our designated payment systems.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">6. Data Protection and Privacy</h3>
          <p className="mb-3">
            We are committed to protecting your personal information in accordance with applicable data protection laws, including GDPR and other relevant privacy regulations. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your data.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">7. Intellectual Property</h3>
          <p className="mb-3">
            All content, materials, and intellectual property on this website are owned by ProHappyAssignments or our licensors. You may not reproduce, distribute, or create derivative works without explicit written permission.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">8. Limitation of Liability</h3>
          <p className="mb-3">
            ProHappyAssignments shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">9. Modifications to Terms</h3>
          <p className="mb-3">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this website. Your continued use of the service constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">10. Contact Information</h3>
          <p className="mb-3">
            If you have any questions about these Terms and Conditions, please contact us through our website's contact form or email support.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-[#1d0fdb] mb-3">11. Governing Law</h3>
          <p className="mb-3">
            These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the appropriate courts.
          </p>
        </section>
      </div>
    </Modal>
  );
};

export default TermsModal;