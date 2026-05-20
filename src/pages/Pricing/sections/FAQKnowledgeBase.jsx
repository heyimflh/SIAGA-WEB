import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqItems } from '../data/faq-data';
import { getFAQPanelId, getFAQButtonId } from '../../SupportingPages/supporting-page-utils';
import { getRegisterPath } from '../../../routes/appRoutes';
import './FAQKnowledgeBase.css';

const categoryChips = ['Pembayaran', 'Escrow', 'Paket', 'Enterprise', 'Refund'];

export default function FAQKnowledgeBase() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFAQ(id);
    }
  };

  return (
    <section className="faq-kb" id="faq-section">
      <div className="faq-kb__container">
        {/* Help card (left on desktop) */}
        <aside className="faq-kb__help">
          <div className="faq-kb__help-card">
            <h2 className="faq-kb__help-title">Masih punya pertanyaan?</h2>
            <p className="faq-kb__help-text">
              Kami rangkum pertanyaan paling umum tentang pembayaran, escrow, paket, dan refund.
            </p>
            <div className="faq-kb__help-chips">
              {categoryChips.map((chip) => (
                <span key={chip} className="faq-kb__help-chip">{chip}</span>
              ))}
            </div>
            <Link to={getRegisterPath('client')} className="faq-kb__help-cta">
              Hubungi Tim SIAGA
            </Link>
          </div>
        </aside>

        {/* FAQ accordion (right on desktop) */}
        <div className="faq-kb__accordion" role="list">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            const panelId = getFAQPanelId(item.id);
            const buttonId = getFAQButtonId(item.id);

            return (
              <div
                key={item.id}
                className={`faq-kb__item ${isOpen ? 'faq-kb__item--open' : ''}`}
                role="listitem"
              >
                <button
                  id={buttonId}
                  className="faq-kb__question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleFAQ(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  type="button"
                >
                  <span className="faq-kb__question-text">{item.question}</span>
                  <span className={`faq-kb__chevron ${isOpen ? 'faq-kb__chevron--open' : ''}`} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <div
                  id={panelId}
                  className="faq-kb__answer"
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                >
                  <p className="faq-kb__answer-text">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
