import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Coffee, ExternalLink, Heart, Loader2, MapPin, RotateCcw, Search, Send, Sparkles, Star, X } from 'lucide-react';
import './styles.css';

const areas = ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Phú Nhuận', 'Tân Bình', 'Thủ Đức'];

const cafes = [
  { id: 1, area: 'Quận 1', name: 'Lá Coffee', rating: 4.6, address: 'Nguyễn Thái Bình, Quận 1', note: 'Ấm áp, yên tĩnh, hợp để nói chuyện lâu.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85' },
  { id: 2, area: 'Quận 1', name: 'The Workshop', rating: 4.5, address: 'Ngô Đức Kế, Quận 1', note: 'Không gian hiện đại, cà phê khá chill.', image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=85' },
  { id: 3, area: 'Quận 3', name: 'Sunday Coffee', rating: 4.7, address: 'Tú Xương, Quận 3', note: 'Nhẹ nhàng, nhiều ánh sáng tự nhiên.', image: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=900&q=85' },
  { id: 4, area: 'Quận 3', name: 'Okkio Caffe', rating: 4.5, address: 'Pasteur, Quận 3', note: 'Một góc nhỏ xinh giữa trung tâm.', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85' },
  { id: 5, area: 'Quận 7', name: 'The Running Bean', rating: 4.5, address: 'Nguyễn Đức Cảnh, Quận 7', note: 'Thoáng, sáng, dễ ngồi lâu.', image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=85' },
  { id: 6, area: 'Bình Thạnh', name: 'Blank Lounge', rating: 4.6, address: 'Điện Biên Phủ, Bình Thạnh', note: 'View đẹp, không gian vừa đủ riêng tư.', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=85' },
  { id: 7, area: 'Bình Thạnh', name: 'The Hideout', rating: 4.7, address: 'Nguyễn Gia Trí, Bình Thạnh', note: 'Một nơi khá chill để kể nhau nghe vài chuyện.', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85' },
  { id: 8, area: 'Phú Nhuận', name: 'Cà Lem', rating: 4.6, address: 'Phan Xích Long, Phú Nhuận', note: 'Nhỏ xinh, ấm cúng và dễ thương.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85' },
  { id: 9, area: 'Tân Bình', name: 'Cheese Coffee', rating: 4.4, address: 'Hoàng Văn Thụ, Tân Bình', note: 'Dễ tìm, thoải mái, không quá cầu kỳ.', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85' },
];

const popularCafesByArea = {
  'Tân Bình': ['Cheese Coffee', 'Highlands Coffee', 'The Coffee House', 'Gia Phúc Cafe'],
  'Quận 1': ['The Workshop', 'Okkio Caffe', 'Lá Coffee', 'Katinat', 'Cộng Cà Phê'],
  'Quận 3': ['Sunday Coffee', 'Okkio Caffe', 'Nấp Saigon', 'Phúc Long'],
  'Quận 7': ['The Running Bean', 'Morico', 'Awesome Coffee', 'Cộng Cà Phê'],
  'Bình Thạnh': ['Blank Lounge', 'The Hideout', 'Cafe Luia', 'Trăng Non Rooftop'],
  'Phú Nhuận': ['Cà Lem', 'Chidori Coffee', 'The Dome Kaffe', 'Pergola'],
  'Thủ Đức': ['Every Half Coffee', 'Zera Cafe', 'Green Garden', 'Cà Phê Sân Vườn']
};

const pageVariants = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0, transition: { duration: .45, ease: 'easeOut' } }, exit: { opacity: 0, y: -14, transition: { duration: .25 } } };

function App() {
  const [step, setStep] = useState('home');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [customPlace, setCustomPlace] = useState({ name: '', address: '', mapsUrl: '' });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const filteredCafes = useMemo(() => cafes.filter(c => c.area === selectedArea), [selectedArea]);
  const isCustom = selectedCafe?.id === 'custom';
  const place = isCustom ? customPlace : selectedCafe;

  const chooseArea = (area) => { setSelectedArea(area); setSelectedCafe(null); setCustomPlace({ name: '', address: '', mapsUrl: '' }); setStep('cafes'); };
  const chooseCafe = (cafe) => { setSelectedCafe(cafe); setSendError(''); setStep('time'); };
  const chooseCustom = () => { setSelectedCafe({ id: 'custom', name: '', address: '', mapsUrl: '' }); setSendError(''); setStep('custom'); };
  const openMaps = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`coffee shops in ${selectedArea}, Ho Chi Minh City`)}`, '_blank', 'noopener,noreferrer');
  const saveCustomPlace = (e) => { e.preventDefault(); if (!customPlace.name.trim()) return; setSelectedCafe({ id: 'custom', name: customPlace.name.trim(), address: customPlace.address.trim(), mapsUrl: customPlace.mapsUrl.trim() }); setStep('time'); };
  const goConfirm = (e) => { e.preventDefault(); if (date && time) setStep('confirm'); };

  const confirm = async () => {
    setSending(true);
    setSendError('');
    const payload = {
      name: 'Mỹ Nguyên',
      area: selectedArea,
      cafeName: place?.name || '',
      address: place?.address || '',
      mapsUrl: place?.mapsUrl || '',
      date,
      time,
      source: isCustom ? 'custom-google-maps' : 'suggested-cafe'
    };

    let sent = false;

    // 1. Thử gửi qua backend local nếu có
    try {
      const response = await fetch('/api/invitations/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        sent = true;
      }
    } catch (e) {
      // Backend không khả dụng (ví dụ khi deploy tĩnh trên GitHub Pages)
    }

    // 2. Nếu backend không phản hồi (khi chạy trên GitHub Pages), gửi trực tiếp qua FormSubmit
    if (!sent) {
      try {
        const formSubmitPayload = {
          ...payload,
          _subject: `☕ Mỹ Nguyên đã chọn: ${payload.cafeName} (${payload.area})`,
          _captcha: 'false',
          _template: 'table'
        };

        const res = await fetch('https://formsubmit.co/ajax/ndao9983@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formSubmitPayload)
        });

        if (res.ok) {
          sent = true;
        }
      } catch (err) {
        console.error('FormSubmit error:', err);
      }
    }

    if (sent) {
      setStep('success');
    } else {
      setSendError('Chưa gửi được thông tin. Bạn thử lại nhé.');
    }
    setSending(false);
  };

  const reset = () => { setSelectedArea(''); setSelectedCafe(null); setCustomPlace({ name: '', address: '', mapsUrl: '' }); setDate(''); setTime(''); setSendError(''); setStep('home'); };
  const progress = { areas: '01', cafes: '02', custom: '02', time: '03', confirm: '04' }[step];

  return <div className="app">
    <div className="grain" />
    <motion.div className="orb orb-a" animate={{ x: [0, 18, 0], y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.div className="orb orb-b" animate={{ x: [0, -16, 0], y: [0, 15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />

    <header className="topbar"><div className="brand"><Coffee size={18} /><span>a little invitation · for Mỹ Nguyên 💌</span></div><div className="progress">{progress ? `☕ ${progress}` : ''}</div></header>

    <main className="shell">
      <AnimatePresence mode="wait">
        {step === 'home' && <motion.section key="home" className="hero" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <motion.div className="eyebrow" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .15 }}>Một chiếc thiệp mời bé xíu 💌 <Sparkles size={14} /></motion.div>
          <h1>Hello,<br /><em>Mỹ Nguyên</em> <span>👋</span></h1>
          <p className="lead">Mặc dù hơi ngại nhưng mà t muốn rủ bạn... 🌸</p>
          <p className="question">Hôm nào rảnh m đi uống café với t nhé? ( ˶ˆ꒳ˆ˵ )</p>
          <motion.button className="primary" onClick={() => setStep('areas')} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: .97 }}>Đi thôii nà ☕ <ArrowRight size={19} /></motion.button>
          <div className="coffee-mark"><Coffee size={42} /><span>☕</span></div>
        </motion.section>}

        {step === 'areas' && <motion.section key="areas" className="content" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep('home')} />
          <div className="section-head"><div className="mini-icon"><MapPin size={19} /></div><p className="kicker">Step 01 · Gặp nhau ở đâu nhỉ?</p><h2>Mỹ Nguyên muốn đi café<br /><em>ở khu vực nào nà?</em> 📍</h2><p>Chọn một quận m tiện đi lại nhất nhen 🌷</p></div>
          <div className="area-grid">{areas.map((area, i) => <motion.button key={area} className="area-card" onClick={() => chooseArea(area)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .045 }} whileHover={{ y: -5 }} whileTap={{ scale: .97 }}><span>{String(i + 1).padStart(2, '0')}</span><strong>{area}</strong><ArrowRight size={17} /></motion.button>)}</div>
        </motion.section>}

        {step === 'cafes' && <motion.section key="cafes" className="content wide" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep('areas')} />
          <div className="section-head left"><p className="kicker">Step 02 · {selectedArea}</p><h2><em>{selectedArea}</em> thẳng tiến! 📍✨</h2><p>Tui tìm được mấy quán xinh xinh ở khu này nè, m ưng quán nào nhất:</p></div>
          <div className="cafe-grid">{filteredCafes.map((cafe, i) => <motion.article className="cafe-card" key={cafe.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }} whileHover={{ y: -7 }}>
            <div className="cafe-image"><img src={cafe.image} alt={cafe.name} /><div className="rating"><Star size={13} fill="currentColor" /> {cafe.rating}</div></div>
            <div className="cafe-body"><div><h3>{cafe.name}</h3><p className="address"><MapPin size={14} /> {cafe.address}</p></div><p className="note">{cafe.note}</p><button className="choose" onClick={() => chooseCafe(cafe)}>Chọn quán này nhen ♡ <Coffee size={16} /></button></div>
          </motion.article>)}</div>
          <motion.div className="custom-choice" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>
            <div><span className="custom-icon"><MapPin size={18} /></span><div><strong>Không ưng mấy quán trên?</strong><p>M có thể tự gõ tên quán m thích nhen, hệ thống sẽ tự tìm vị trí luôn 🔍</p></div></div>
            <button className="custom-button" onClick={chooseCustom}>Tự chọn quán khác <ExternalLink size={16} /></button>
          </motion.div>
        </motion.section>}

        {step === 'custom' && <motion.section key="custom" className="content narrow" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep('cafes')} />
          <div className="section-head">
            <div className="mini-icon"><MapPin size={19} /></div>
            <p className="kicker">Step 02 · Your choice</p>
            <h2>M ưng quán nào nà?<br /><em>Chọn nhen.</em> 📍</h2>
            <p>Tìm hoặc gõ tên quán bạn thích ở {selectedArea}, hệ thống sẽ tự động tìm địa chỉ & vị trí chính xác.</p>
          </div>
          <CustomCafeSearch
            selectedArea={selectedArea}
            customPlace={customPlace}
            setCustomPlace={setCustomPlace}
            onSave={saveCustomPlace}
            onOpenMaps={openMaps}
          />
        </motion.section>}

        {step === 'time' && selectedCafe && <motion.section key="time" className="content narrow" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep(isCustom ? 'custom' : 'cafes')} />
          <div className="section-head"><div className="mini-icon"><Coffee size={19} /></div><p className="kicker">Step 03 · Lúc nào rảnh nè?</p><h2>Vậy còn lúc nào<br /><em>thì m rảnh?</em> ⏰ ☕</h2><p>Chọn ngày và khoảng thời gian m thấy thoải mái nhất nhó!</p></div>
          <form className="time-panel" onSubmit={goConfirm}>
            <div className="time-picked"><span>📍</span><div><small>Địa điểm đã chọn</small><strong>{place.name}</strong><small>{place.address || selectedArea}</small></div></div>
            <div className="date-time-grid"><label>Ngày hẹn<input type="date" required min={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} /></label><label>Giờ hẹn<input type="time" required value={time} onChange={e => setTime(e.target.value)} /></label></div>
            <p className="hint">✨ Ngày nào m rảnh cũng là ngày đẹp trời hết ó 🌿</p>
            <button className="primary full" type="submit">Tiếp tục thôii <ArrowRight size={18} /></button>
          </form>
        </motion.section>}

        {step === 'confirm' && selectedCafe && <motion.section key="confirm" className="confirm" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep('time')} />
          <div className="confirm-card"><motion.div className="heart" animate={{ scale: [1, 1.14, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}><Heart size={26} fill="currentColor" /></motion.div><p className="kicker">Step 04 · Chốt kèo</p><h2>It's a date...<br /><em>maybe?</em> 👉👈 ☕</h2><p>Mỹ Nguyên đã chọn:</p><div className="picked"><span>📍</span><div><small>Khu vực</small><strong>{selectedArea}</strong></div></div><div className="picked"><span>☕</span><div><small>Địa điểm</small><strong>{place.name}</strong><small>{place.address || 'Tự chọn trên Google Maps'}</small></div></div><div className="picked"><span>🗓️</span><div><small>Thời gian</small><strong>{date} · {time}</strong></div></div>{place.mapsUrl && <a className="maps-link" href={place.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Xem địa điểm trên Google Maps ↗</a>}<p className="promise">~ M chỉ việc lên đồ thật xinh thôi, còn lại để t lo hết nhen! 🌷 ~</p>{sendError && <p className="send-error">{sendError}</p>}<button className="primary full" onClick={confirm} disabled={sending}>{sending ? 'Đang gửi thông tin...' : <>Chốt đơn nhen 💌 <Send size={17} /></>}</button></div>
        </motion.section>}

        {step === 'success' && <motion.section key="success" className="confirm" variants={pageVariants} initial="initial" animate="animate" exit="exit"><div className="success-card"><motion.div className="success-icon" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 13 }}><Check size={36} /></motion.div><h2>Yayy! Chốt kèo 💖</h2><p>Lựa chọn của bạn đã được gửi thẳng tới tui rồi nè!</p><div className="summary"><span>📍 Khu vực: {selectedArea}</span><span>☕ Quán: {place?.name}</span><span>🗓️ Thời gian: {date} · {time}</span></div><p className="promise">Hẹn gặp bạn sớm nhaaa 🧸🌷</p><div className="success-actions"><button className="ghost" onClick={() => setStep('confirm')}><ArrowLeft size={16} /> Xem lại</button><button className="ghost" onClick={reset}><RotateCcw size={16} /> Chọn lại từ đầu</button></div></div></motion.section>}
      </AnimatePresence>
    </main>
    <footer>made with ☕ & a little courage · for Mỹ Nguyên ♡</footer>
  </div>
}

function CustomCafeSearch({ selectedArea, customPlace, setCustomPlace, onSave, onOpenMaps }) {
  const [query, setQuery] = useState(customPlace.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Search logic with debounce using Photon OpenStreetMap API
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    if (selectedItem && selectedItem.name.toLowerCase() === query.trim().toLowerCase()) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const q1 = `${query.trim()} ${selectedArea || ''} Ho Chi Minh`;
        const res1 = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q1)}&lat=10.7769&lon=106.7009&limit=6`);
        let data = await res1.json();
        let features = data.features || [];

        if (features.length === 0) {
          const q2 = `${query.trim()} Ho Chi Minh`;
          const res2 = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q2)}&lat=10.7769&lon=106.7009&limit=6`);
          data = await res2.json();
          features = data.features || [];
        }

        const list = features.map(f => {
          const p = f.properties || {};
          const [lon, lat] = f.geometry?.coordinates || [];
          const parts = [
            p.housenumber ? `${p.housenumber} ${p.street || ''}`.trim() : p.street,
            p.district || p.locality,
            p.city || 'TP. Hồ Chí Minh'
          ].filter(Boolean);
          return {
            id: `${p.osm_type || ''}_${p.osm_id || Math.random()}`,
            name: p.name || query.trim(),
            district: p.district || p.locality || '',
            address: parts.join(', '),
            lat,
            lon,
            mapsUrl: lat && lon ? `https://www.google.com/maps?q=${lat},${lon}` : ''
          };
        });

        setSuggestions(list);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, selectedArea, selectedItem]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setQuery(item.name);
    setCustomPlace({
      name: item.name,
      address: item.address,
      mapsUrl: item.mapsUrl
    });
    setIsOpen(false);
  };

  const handleChipClick = (cafeName) => {
    setSelectedItem(null);
    setQuery(cafeName);
    setCustomPlace(v => ({ ...v, name: cafeName }));
  };

  const handleClear = () => {
    setQuery('');
    setSelectedItem(null);
    setCustomPlace({ name: '', address: '', mapsUrl: '' });
    setSuggestions([]);
    setIsOpen(false);
  };

  const quickChips = popularCafesByArea[selectedArea] || ['Highlands Coffee', 'The Coffee House', 'Cheese Coffee', 'Phúc Long'];

  return (
    <div className="custom-panel">
      {/* Quick suggest chips */}
      <div className="quick-chips">
        <span className="quick-chip-label">⚡ Gợi ý quán nổi bật ở {selectedArea}:</span>
        {quickChips.map(name => (
          <button
            type="button"
            key={name}
            className="chip"
            onClick={() => handleChipClick(name)}
          >
            ☕ {name}
          </button>
        ))}
      </div>

      <form onSubmit={onSave} className="custom-form">
        {/* Search input with autocomplete dropdown */}
        <label>
          Tên quán café <span>(Gõ để tìm kiếm tự động)</span>
          <div className="search-container" ref={containerRef}>
            <div className="search-input-wrap">
              <Search size={17} className="search-icon-left" />
              <input
                required
                className="search-input"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedItem(null);
                  setCustomPlace(v => ({ ...v, name: e.target.value }));
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setIsOpen(true);
                }}
                placeholder="Ví dụ: Cheese Coffee, Highlands..."
              />
              {isLoading ? (
                <Loader2 size={16} className="search-spinner" />
              ) : query ? (
                <button type="button" className="search-clear" onClick={handleClear}>
                  <X size={15} />
                </button>
              ) : null}
            </div>

            {/* Dropdown suggestions */}
            {isOpen && (
              <div className="suggestions-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.map((item, idx) => (
                    <button
                      type="button"
                      key={item.id || idx}
                      className="suggestion-item"
                      onClick={() => handleSelect(item)}
                    >
                      <Coffee size={17} className="suggestion-icon" />
                      <div className="suggestion-content">
                        <div className="suggestion-header">
                          <span className="suggestion-name">{item.name}</span>
                          {item.district && <span className="suggestion-badge">{item.district}</span>}
                        </div>
                        {item.address && <span className="suggestion-addr">{item.address}</span>}
                      </div>
                    </button>
                  ))
                ) : !isLoading && query.trim().length >= 2 ? (
                  <div className="dropdown-empty">
                    Không tìm thấy quán tương ứng. Bạn có thể tự điền địa chỉ bên dưới nhé!
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </label>

        {/* Verified Location Banner */}
        {customPlace.mapsUrl && (
          <div className="verified-banner">
            <div>
              <CheckCircle2 size={16} />
              <span>Đã tự động định vị vị trí chuẩn xác!</span>
            </div>
            <a href={customPlace.mapsUrl} target="_blank" rel="noreferrer">
              Xem vị trí <ExternalLink size={13} />
            </a>
          </div>
        )}

        <label>
          Địa chỉ <span>(tự điền khi chọn gợi ý hoặc chỉnh sửa)</span>
          <input
            value={customPlace.address}
            onChange={e => setCustomPlace(v => ({ ...v, address: e.target.value }))}
            placeholder="Địa chỉ quán (số nhà, tên đường...)"
          />
        </label>

        <label>
          Link Google Maps <span>(tự động tạo theo toạ độ)</span>
          <input
            type="url"
            value={customPlace.mapsUrl}
            onChange={e => setCustomPlace(v => ({ ...v, mapsUrl: e.target.value }))}
            placeholder="https://maps.google.com/..."
          />
        </label>

        <button className="primary full" type="submit">
          Chọn quán này <ArrowRight size={18} />
        </button>

        <button
          type="button"
          className="maps-button"
          style={{ marginTop: '8px', marginBottom: 0 }}
          onClick={onOpenMaps}
        >
          <MapPin size={16} /> Hoặc mở Google Maps tìm kiếm <ExternalLink size={14} />
        </button>
      </form>
    </div>
  );
}

function Back({ onClick }) { return <button className="back" onClick={onClick}><ArrowLeft size={16} /> Back</button>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
