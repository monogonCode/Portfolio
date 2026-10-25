import React, { useState } from 'react';
import { getProfile } from '../../data/profile';
import { sound } from '../../lib/sound';
import { 
  PixelMailRight, 
  PixelMessage, 
  PixelLinkedin, 
  PixelCheckDouble, 
  PixelMapPin, 
  PixelPhone 
} from '../ui/RetroIcons';
import { useLanguage } from '../../i18n/LanguageContext';

interface ContactAppProps {
  onClose?: () => void;
}

export const ContactApp: React.FC<ContactAppProps> = ({ onClose }) => {
  const { lang, isEn } = useLanguage();
  const profile = getProfile(lang);
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWindowClose();

    // Construct mailto link
    const defaultSubject = isEn ? 'Contact from Retro Portfolio' : 'Contacto desde Portfolio Retro';
    const fromLabel = isEn ? 'From' : 'De';
    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(subject || defaultSubject)}&body=${encodeURIComponent(`${fromLabel}: ${senderEmail}\n\n${message}`)}`;
    window.open(mailtoUrl, '_blank');

    setIsSent(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#d4d0c8', padding: '10px' }}>
      {/* Outlook Toolbar with Pixel Icons */}
      <div style={{ display: 'flex', gap: '4px', paddingBottom: '8px', borderBottom: '1px solid #808080', marginBottom: '10px' }}>
        <button
          onClick={handleSend}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer'
          }}
        >
          <PixelMailRight size={14} color="#000080" />
          <span>{isEn ? 'Send Mail' : 'Enviar Correo'}</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: '#808080', margin: '0 4px' }} />

        <a
          href={`https://wa.me/34665429177?text=${encodeURIComponent(
            isEn
              ? 'Hi Martín, I just saw your portfolio and would like to get in touch with you.'
              : 'Hola Martín, he visto tu portfolio y me gustaría contactar contigo.'
          )}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            fontSize: '11px',
            textDecoration: 'none',
            color: '#000',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff'
          }}
        >
          <PixelMessage size={13} color="#16a34a" />
          <span>WhatsApp</span>
        </a>

        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            fontSize: '11px',
            textDecoration: 'none',
            color: '#000',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff'
          }}
        >
          <PixelLinkedin size={13} color="#0284c7" />
          <span>LinkedIn</span>
        </a>
      </div>

      {isSent ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', padding: '20px', border: '2px solid #808080' }}>
          <PixelCheckDouble size={48} color="#16a34a" />
          <h3 style={{ margin: '12px 0 4px 0', fontSize: '15px', color: '#16a34a' }}>
            {isEn ? 'Message Sent Successfully!' : '¡Mensaje Enviado con Éxito!'}
          </h3>
          <p style={{ fontSize: '11px', color: '#475569', textAlign: 'center' }}>
            {isEn
              ? `Your email client has been opened to send the message directly to ${profile.email}.`
              : `Se ha abierto tu cliente de correo para remitir el mensaje directamente a ${profile.email}.`}
            <br />
            {isEn ? 'Closing Outlook Express window...' : 'Cerrando ventana de Outlook Express...'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSend} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Header fields */}
          <div style={{ background: '#ffffff', border: '2px solid', borderColor: '#808080 #ffffff #ffffff #808080', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
              <span style={{ width: '80px', fontWeight: 'bold' }}>{isEn ? 'To:' : 'Para:'}</span>
              <div style={{ flex: 1, padding: '2px 6px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '500' }}>
                {profile.name} &lt;{profile.email}&gt;
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
              <span style={{ width: '80px', fontWeight: 'bold' }}>{isEn ? 'Your Email:' : 'Tu Email:'}</span>
              <input
                type="email"
                required
                placeholder={isEn ? 'example@company.com' : 'ejemplo@empresa.com'}
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                style={{ flex: 1, padding: '3px 6px', fontSize: '11px', border: '1px solid #94a3b8' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
              <span style={{ width: '80px', fontWeight: 'bold' }}>{isEn ? 'Subject:' : 'Asunto:'}</span>
              <input
                type="text"
                required
                placeholder={isEn ? 'Project proposal / Job opportunity' : 'Propuesta de proyecto / Oportunidad laboral'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ flex: 1, padding: '3px 6px', fontSize: '11px', border: '1px solid #94a3b8' }}
              />
            </div>
          </div>

          {/* Body Textarea */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <textarea
              required
              placeholder={isEn ? 'Write your message, inquiry or proposal details here...' : 'Escribe aquí tu mensaje, consulta o detalles de la propuesta...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                minHeight: '160px',
                padding: '8px',
                fontFamily: 'inherit',
                fontSize: '12px',
                border: '2px solid',
                borderColor: '#808080 #ffffff #ffffff #808080',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <PixelMapPin size={11} color="#64748b" /> {profile.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <PixelPhone size={11} color="#64748b" /> {profile.phone}
              </span>
            </div>
            <button
              type="submit"
              style={{
                padding: '5px 16px',
                fontWeight: 'bold',
                fontSize: '11px',
                background: '#000080',
                color: '#ffffff',
                border: '2px solid',
                borderColor: '#ffffff #000000 #000000 #ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <PixelMailRight size={12} color="#ffffff" />
              <span>{isEn ? 'Send' : 'Enviar'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
