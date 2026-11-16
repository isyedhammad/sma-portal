import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  X,
  Download,
  ExternalLink,
  Printer,
  Search,
  BookOpen,
  FileText,
  Scale,
  CheckCircle2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const RULES_DATA = [
  {
    chapter: 'Part I: Preliminary & Definitions',
    rules: [
      {
        num: 'Rule 1',
        title: 'Short Title and Commencement',
        text: '(1) These rules may be called the Punjab Mining Concession Rules, 2002.\n(2) They shall extend to the whole of the Province of the Punjab and shall come into force at once.'
      },
      {
        num: 'Rule 2',
        title: 'Statutory Definitions',
        text: 'In these rules, unless there is anything repugnant in the subject or context:\n• "Authority" or "Licensing Authority" means the officer authorized to grant and regulate concessions under these rules;\n• "Small Scale Mining (SSM)" means mining operations carried out under Small Mines Assistance/Titles (SMA) frameworks;\n• "Mining Lease (ML)" means a lease granted to mine, extract, and dispose of specified minerals;\n• "Prospecting License (PL)" means a license to prospect, survey, and explore for minerals within a demarcated block;\n• "Personal Hearing" means statutory hearing granted to a lessee or licensee before the Licensing Authority in accordance with the principles of natural justice;\n• "Concession" means a mineral title including a Reconnaissance License, Exploration License, Prospecting License, or Mining Lease.'
      }
    ]
  },
  {
    chapter: 'Part II: Small Scale Mining Concessions (ML & PL)',
    rules: [
      {
        num: 'Rule 14',
        title: 'Application for Prospecting License (PL) and Mining Lease (ML)',
        text: 'Every application for a Prospecting License or Mining Lease shall be submitted in prescribed format to the Licensing Authority accompanied by statutory fees, cadastral survey coordinates, and valid credentials.'
      },
      {
        num: 'Rule 18',
        title: 'Prospecting License (PL) Rights & Conditions',
        text: 'A Prospecting License confers exclusive rights to prospect for specified minerals across demarcated acreage for an initial period not exceeding 2 years, subject to timely submission of quarterly exploration reports.'
      },
      {
        num: 'Rule 24',
        title: 'Conversion of PL into Mining Lease (ML)',
        text: 'A licensee who has discovered commercial mineral reserves during the prospecting term has priority to apply for conversion into a full Mining Lease (ML) subject to approved mining scheme and environmental protection guidelines.'
      },
      {
        num: 'Rule 29',
        title: 'Statutory Period and Renewals of Mining Lease',
        text: 'A Mining Lease for small-scale mining shall be granted for a statutory period up to 10 years, renewable upon satisfactory compliance with royalty payments, production returns, boundary maintenance, and mine safety.'
      }
    ]
  },
  {
    chapter: 'Part III: Financial Obligations & Royalties',
    rules: [
      {
        num: 'Rule 35',
        title: 'Assessment and Payment of Royalties',
        text: 'The lessee shall pay royalty at statutory rates notified by the Government on all minerals extracted, dispatched, or sold from the leased area into designated Government Treasury accounts (National Bank of Pakistan).'
      },
      {
        num: 'Rule 38',
        title: 'Surface Rent and Dead Rent',
        text: 'Annual surface rent and dead rent shall be deposited into the Government treasury through computerized treasury challans by or before prescribed statutory deadlines.'
      },
      {
        num: 'Rule 42',
        title: 'Inspection of Weighbridges, Despatches and Accounts',
        text: 'The Licensing Authority or authorized field officer shall have powers to inspect dispatch registers, pitheads, weighbridges, and raw transit permits at any working quarry.'
      }
    ]
  },
  {
    chapter: 'Part IV: Statutory Personal Hearings & Post-Hearing Orders',
    rules: [
      {
        num: 'Rule 48',
        title: 'Statutory Show-Cause Notice & Right of Personal Hearing',
        text: '(1) Where a lessee or licensee commits a breach of any condition of lease, defaults on royalty dues, encroaches outside demarcated boundaries, or fails to submit monthly production returns, the Licensing Authority shall serve a formal Show-Cause Notice specifying the grounds of default.\n(2) The notice recipient shall be granted not less than 15 days to submit a written explanation and shall be afforded an opportunity of personal hearing before the Licensing Authority.\n(3) All proceedings of personal hearings shall be conducted by the Licensing Authority, proceedings duly minuted, and formal bench orders recorded.'
      },
      {
        num: 'Rule 51',
        title: 'Post-Hearing Decisions & Imposition of Penalties',
        text: 'After evaluating oral submissions, treasury challans, and field reports, the Licensing Authority may:\n(a) Accept compliance and exonerate the concessionaire;\n(b) Grant an adjournment with specific directions for treasury reconciliation;\n(c) Impose financial penalties under statutory provisions;\n(d) Suspend mining operations; or\n(e) Issue orders of cancellation under Rule 56.'
      },
      {
        num: 'Rule 56',
        title: 'Determination and Cancellation of Lease',
        text: 'If the lessee fails to remedy the breach within the statutory period allowed or fails to comply with the bench orders, the Licensing Authority may determine and cancel the lease and forfeit the security deposit.'
      },
      {
        num: 'Rule 58',
        title: 'Right of Appeal to Secretary Mines & Minerals',
        text: 'Any person aggrieved by an order of the Licensing Authority under these rules may, within 30 days of communication of the order, prefer an appeal to the Appellate Authority (Secretary, Mines & Minerals Department, Government of the Punjab).'
      },
      {
        num: 'Rule 60',
        title: 'Recovery of Government Dues as Arrears of Land Revenue',
        text: 'All outstanding royalties, penalties, and arrears under these rules shall be recoverable as arrears of land revenue through the District Collector.'
      }
    ]
  }
];

export const RulesModal: React.FC = () => {
  const { isRulesModalOpen, setIsRulesModalOpen } = usePortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'Part I: Preliminary & Definitions': true,
    'Part IV: Statutory Personal Hearings & Post-Hearing Orders': true
  });

  if (!isRulesModalOpen) return null;

  const toggleChapter = (chapter: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapter]: !prev[chapter]
    }));
  };

  const filteredRulesData = RULES_DATA.map(group => {
    if (!searchQuery.trim()) return group;
    const q = searchQuery.toLowerCase();
    const matching = group.rules.filter(
      r =>
        r.num.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q)
    );
    return {
      ...group,
      rules: matching
    };
  }).filter(group => group.rules.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-slate-300 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="no-print bg-[#01411C] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-900/80 border border-emerald-700">
              <BookOpen className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                  Government of the Punjab • Mines &amp; Minerals Department
                </span>
              </div>
              <h2 className="text-base font-bold tracking-tight text-white">
                The Punjab Mining Concession Rules, 2002
              </h2>
              <p className="text-xs text-emerald-100/80">
                Statutory Provincial Regulations for Small Scale Mining, ML, PL &amp; Personal Hearings
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {/* Direct PDF Download Button */}
            <a
              href="./Punjab_Mining_Concession_Rules_2002.pdf"
              download="Punjab_Mining_Concession_Rules_2002.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37] hover:bg-[#c49f29] text-slate-950 shadow-sm transition-all"
              title="Download official Rules PDF document"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download PDF</span>
            </a>

            {/* Open PDF in New Tab */}
            <a
              href="./Punjab_Mining_Concession_Rules_2002.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              title="Open full PDF in browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              <span>Open PDF</span>
            </a>

            <button
              onClick={() => setIsRulesModalOpen(false)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar inside Rules */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Rules (e.g. Rule 48, Rule 56, personal hearing, royalty, penalty, appeal)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Rules Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {filteredRulesData.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Scale className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold">No matching rules found for "{searchQuery}".</p>
            </div>
          ) : (
            filteredRulesData.map((group) => {
              const isExpanded = expandedChapters[group.chapter] ?? true;

              return (
                <div key={group.chapter} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  {/* Chapter Header */}
                  <button
                    onClick={() => toggleChapter(group.chapter)}
                    className="w-full bg-slate-100/80 px-4 py-2.5 text-left flex items-center justify-between border-b border-slate-200 hover:bg-slate-200/70 transition-colors"
                  >
                    <span className="font-bold text-[#01411C] text-xs uppercase tracking-wide">
                      {group.chapter}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span>{group.rules.length} Rules</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Rules Accordion Body */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 bg-white divide-y divide-slate-100">
                      {group.rules.map((rule, idx) => (
                        <div key={idx} className={idx > 0 ? 'pt-3.5' : ''}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-[#01411C] text-white text-[10px] font-black px-2 py-0.5 rounded">
                              {rule.num}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">
                              {rule.title}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs pl-1">
                            {rule.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Government Gazette Reference • Law &amp; Parliamentary Affairs</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="./Punjab_Mining_Concession_Rules_2002.pdf"
              download="Punjab_Mining_Concession_Rules_2002.pdf"
              className="text-[#01411C] hover:underline font-bold"
            >
              Download Full PDF Document
            </a>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsRulesModalOpen(false)}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
