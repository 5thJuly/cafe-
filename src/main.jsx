import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Coffee, ExternalLink, Heart, MapPin, RotateCcw, Send, Sparkles, Star } from 'lucide-react';
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
  { id: 10, area: 'Thủ Đức', name: 'Every Half Coffee', rating: 4.7, address: 'Võ Văn Ngân, Thủ Đức', note: 'Một lựa chọn nhẹ nhàng cho một buổi chiều.', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85' }
];

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

    <header className="topbar"><div className="brand"><Coffee size={18} /><span>just a little invitation</span></div><div className="progress">{progress ? `☕ ${progress}` : ''}</div></header>

    <main className="shell">
      <AnimatePresence mode="wait">
        {step === 'home' && <motion.section key="home" className="hero" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <motion.div className="eyebrow" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .15 }}>A tiny digital invitation <Sparkles size={14} /></motion.div>
          <h1>Hello,<br /><em>Mỹ Nguyên</em> <span>👋</span></h1>
          <p className="lead">Mặc dù hơi ngại nhưng mà t muốn chúng ta =))))) .</p>
          <p className="question">Would you like to go for a coffee with me?</p>
          <motion.button className="primary" onClick={() => setStep('areas')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: .97 }}>Let's go <ArrowRight size={19} /></motion.button>
          <div className="coffee-mark"><Coffee size={42} /><span>☕</span></div>
        </motion.section>}

        {step === 'areas' && <motion.section key="areas" className="content" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep('home')} />
          <div className="section-head"><div className="mini-icon"><MapPin size={19} /></div><p className="kicker">Step 01</p><h2>Mỹ Nguyên muốn đi café<br /><em>ở khu vực nào?</em></h2><p>Chọn ii bbi oii.</p></div>
          <div className="area-grid">{areas.map((area, i) => <motion.button key={area} className="area-card" onClick={() => chooseArea(area)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .045 }} whileHover={{ y: -5 }} whileTap={{ scale: .97 }}><span>{String(i + 1).padStart(2, '0')}</span><strong>{area}</strong><ArrowRight size={17} /></motion.button>)}</div>
        </motion.section>}

        {step === 'cafes' && <motion.section key="cafes" className="content wide" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep('areas')} />
          <div className="section-head left"><p className="kicker">Step 02 · {selectedArea}</p><h2><em>{selectedArea}</em> it is! 📍</h2><p>Mình tìm được vài chỗ ở khu vực này. Bạn thích nơi nào?</p></div>
          <div className="cafe-grid">{filteredCafes.map((cafe, i) => <motion.article className="cafe-card" key={cafe.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }} whileHover={{ y: -7 }}>
            <div className="cafe-image"><img src={cafe.image} alt={cafe.name} /><div className="rating"><Star size={13} fill="currentColor" /> {cafe.rating}</div></div>
            <div className="cafe-body"><div><h3>{cafe.name}</h3><p className="address"><MapPin size={14} /> {cafe.address}</p></div><p className="note">{cafe.note}</p><button className="choose" onClick={() => chooseCafe(cafe)}>I'd choose this <Coffee size={16} /></button></div>
          </motion.article>)}</div>
          <motion.div className="custom-choice" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>
            <div><span className="custom-icon"><MapPin size={18} /></span><div><strong>Không thích những quán này?</strong><p>Hay là m tự chọn một địa điểm oke trên Google Maps nhé.</p></div></div>
            <button className="custom-button" onClick={chooseCustom}>Tự chọn địa điểm <ExternalLink size={16} /></button>
          </motion.div>
        </motion.section>}

        {step === 'custom' && <motion.section key="custom" className="content narrow" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep('cafes')} />
          <div className="section-head"><div className="mini-icon"><MapPin size={19} /></div><p className="kicker">Step 02 · Your choice</p><h2>Không vấn đề gì.<br /><em>Chọn nhé.</em> 📍</h2><p>Mở Google Maps, tìm quán bạn thích ở {selectedArea}, rồi điền lại tên quán bên dưới.</p></div>
          <div className="custom-panel">
            <motion.button className="maps-button" onClick={openMaps} whileHover={{ y: -2 }} whileTap={{ scale: .98 }}><MapPin size={18} /> Mở Google Maps <ExternalLink size={15} /></motion.button>
            <form onSubmit={saveCustomPlace} className="custom-form">
              <label>Tên quán café<input required value={customPlace.name} onChange={e => setCustomPlace(v => ({ ...v, name: e.target.value }))} placeholder="Ví dụ: The Workshop..." /></label>
              <label>Địa chỉ <span>(không bắt buộc)</span><input value={customPlace.address} onChange={e => setCustomPlace(v => ({ ...v, address: e.target.value }))} placeholder="Địa chỉ quán" /></label>
              <label>Link Google Maps <span>(không bắt buộc)</span><input type="url" value={customPlace.mapsUrl} onChange={e => setCustomPlace(v => ({ ...v, mapsUrl: e.target.value }))} placeholder="https://maps.google.com/..." /></label>
              <button className="primary full" type="submit">Chọn quán này <ArrowRight size={18} /></button>
            </form>
          </div>
        </motion.section>}

        {step === 'time' && selectedCafe && <motion.section key="time" className="content narrow" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep(isCustom ? 'custom' : 'cafes')} />
          <div className="section-head"><div className="mini-icon"><Coffee size={19} /></div><p className="kicker">Step 03 · Almost there</p><h2>Vậy còn lúc nào<br /><em>bạn rảnh?</em> ☕</h2><p>Chọn ngày và khoảng thời gian m thấy thoải mái nhất.</p></div>
          <form className="time-panel" onSubmit={goConfirm}>
            <div className="time-picked"><span>📍</span><div><small>Địa điểm</small><strong>{place.name}</strong><small>{place.address || selectedArea}</small></div></div>
            <div className="date-time-grid"><label>Ngày<input type="date" required min={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} /></label><label>Giờ<input type="time" required value={time} onChange={e => setTime(e.target.value)} /></label></div>
            <p className="hint">Chọn bất kỳ ngày/giờ nào m thấy thoải mái nhất nhó !!! 🌿</p>
            <button className="primary full" type="submit">Tiếp tục <ArrowRight size={18} /></button>
          </form>
        </motion.section>}

        {step === 'confirm' && selectedCafe && <motion.section key="confirm" className="confirm" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Back onClick={() => setStep('time')} />
          <div className="confirm-card"><motion.div className="heart" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.8, repeat: Infinity }}><Heart size={24} fill="currentColor" /></motion.div><p className="kicker">Step 04</p><h2>It's a date...<br /><em>maybe?</em> 👀☕</h2><p>Bạn đã chọn:</p><div className="picked"><span>📍</span><div><small>Khu vực</small><strong>{selectedArea}</strong></div></div><div className="picked"><span>☕</span><div><small>Địa điểm</small><strong>{place.name}</strong><small>{place.address || 'Tự chọn trên Google Maps'}</small></div></div><div className="picked"><span>🗓️</span><div><small>Thời gian</small><strong>{date} · {time}</strong></div></div>{place.mapsUrl && <a className="maps-link" href={place.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Xem địa điểm trên Google Maps</a>}<p className="promise">Mình sẽ lo phần còn lại nhé.</p>{sendError && <p className="send-error">{sendError}</p>}<button className="primary full" onClick={confirm} disabled={sending}>{sending ? 'Đang gửi...' : <>Confirm <Send size={17} /></>}</button></div>
        </motion.section>}

        {step === 'success' && <motion.section key="success" className="confirm" variants={pageVariants} initial="initial" animate="animate" exit="exit"><div className="success-card"><motion.div className="success-icon" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 13 }}><Check size={34} /></motion.div><h2>Got it! <span>💙</span></h2><p>Lựa chọn của bạn đã được gửi rồi.</p><div className="summary"><span>📍 {selectedArea}</span><span>☕ {place?.name}</span><span>🗓️ {date} · {time}</span></div><p className="promise">See you soon.</p><div className="success-actions"><button className="ghost" onClick={() => setStep('confirm')}><ArrowLeft size={16} /> Back</button><button className="ghost" onClick={reset}><RotateCcw size={16} /> Start again</button></div></div></motion.section>}
      </AnimatePresence>
    </main>
    <footer>made with ☕ & a little courage</footer>
  </div>
}

function Back({ onClick }) { return <button className="back" onClick={onClick}><ArrowLeft size={16} /> Back</button>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
