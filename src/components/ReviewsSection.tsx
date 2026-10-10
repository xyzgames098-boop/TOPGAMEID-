import React, { useState } from 'react';
import { CustomerReview } from '../types/topup';
import { Star, MessageSquarePlus, CheckCircle2, Trophy } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: CustomerReview) => void;
  currentUserBadge?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  onOpenAchievementsModal?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  reviews, 
  onAddReview,
  currentUserBadge,
  onOpenAchievementsModal,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [serviceName, setServiceName] = useState('Mobile Legends: Bang Bang');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      avatarLetter: authorName.trim().charAt(0).toUpperCase(),
      avatarColor: 'bg-amber-600',
      gameOrService: serviceName,
      rating,
      comment: comment.trim(),
      date: 'Baru saja',
      isVerifiedPurchase: true,
      achievementBadge: currentUserBadge,
    };

    onAddReview(newRev);
    setAuthorName('');
    setComment('');
    setShowAddForm(false);
  };

  return (
    <section id="ulasan" className="py-12 border-b border-neutral-800/80 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Kepuasan Pelanggan 100%
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Ulasan & Testimoni Gamer Indonesia
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white font-mono">4.9 / 5.0</span>
              <span aria-hidden="true">·</span>
              <span>Berdasarkan 85.420+ transaksi terverifikasi</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showAddForm ? 'Batal Tulis' : 'Tulis Ulasan Kamu'}</span>
          </button>
        </div>

        {/* Add Review Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 max-w-2xl"
          >
            <h3 className="text-sm font-bold text-white">Bagikan Pengalaman Top Up Kamu</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Nama atau Nickname</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Contoh: Budi Gamer"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Layanan yang Dibeli</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                >
                  <option value="Mobile Legends: Bang Bang">Mobile Legends: Bang Bang</option>
                  <option value="Free Fire">Free Fire</option>
                  <option value="PUBG Mobile">PUBG Mobile</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Genshin Impact">Genshin Impact</option>
                  <option value="Token Listrik PLN">Token Listrik PLN</option>
                  <option value="DANA & E-Wallet">DANA & E-Wallet</option>
                  <option value="Program Reseller">Program Reseller</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Rating Bintang</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        starVal <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Ulasan & Komentar</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan kecepatan pengiriman dan kepuasan Anda..."
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white"
              />
            </div>

            {currentUserBadge && (
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{currentUserBadge.icon}</span>
                  <span className="text-neutral-300">
                    Lencana Profil Anda: <strong className="text-white">{currentUserBadge.name}</strong>
                  </span>
                </div>
                {onOpenAchievementsModal && (
                  <button
                    type="button"
                    onClick={onOpenAchievementsModal}
                    className="text-amber-400 hover:text-amber-300 hover:underline text-[11px] font-medium"
                  >
                    Ubah Lencana
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Kirim Ulasan Sekarang
            </button>
          </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full ${rev.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                    >
                      {rev.avatarLetter}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                        <span>{rev.author}</span>
                        {rev.isVerifiedPurchase && (
                          <span title="Pembeli Terverifikasi">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          </span>
                        )}
                        {rev.achievementBadge && (
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${rev.achievementBadge.color}`}>
                            <span>{rev.achievementBadge.icon}</span>
                            <span>{rev.achievementBadge.name}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{rev.gameOrService}</div>
                    </div>
                  </div>

                  <div className="flex text-amber-400 shrink-0">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="text-[10px] text-neutral-500 font-mono pt-2 border-t border-neutral-800/80">
                {rev.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
