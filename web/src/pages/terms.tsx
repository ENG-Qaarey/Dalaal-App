'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';

const TermsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-transparent">
      <PageBackground />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              {t.footer.terms || 'Terms of Service'}
            </h1>
          </div>

          <div className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-lg dark:shadow-2xl prose dark:prose-invert max-w-none">
            <div className="space-y-8 text-gray-800 dark:text-gray-200">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using DalaalConnect, you accept and agree to be bound by the terms and provision of this agreement.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on DalaalConnect for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to decompile or reverse engineer any software contained on DalaalConnect</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Disclaimer</h2>
                <p>The materials on DalaalConnect are provided on an 'as is' basis. DalaalConnect makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Limitations</h2>
                <p>In no event shall DalaalConnect or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DalaalConnect, even if DalaalConnect or a DalaalConnect authorized representative has been notified orally or in writing of the possibility of such damage.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Accuracy of Materials</h2>
                <p>The materials appearing on DalaalConnect could include technical, typographical, or photographic errors. DalaalConnect does not warrant that any of the materials on DalaalConnect are accurate, complete, or current. DalaalConnect may make changes to the materials contained on its website at any time without notice.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Links</h2>
                <p>DalaalConnect has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by DalaalConnect of the site. Use of any such linked website is at the user's own risk.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Modifications</h2>
                <p>DalaalConnect may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Governing Law</h2>
                <p>These terms and conditions are governed by and construed in accordance with the laws of Somalia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
