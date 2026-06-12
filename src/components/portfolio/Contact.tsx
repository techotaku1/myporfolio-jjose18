'use client';

import { useState } from 'react';
import { PROFILE } from './constants';

type FormState = { name: string; email: string; msg: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', msg: '' });
  const [errs, setErrs] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const set =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const submit = async () => {
    const next: FormErrors = {};
    if (!form.name.trim()) {
      next.name = 'Requerido';
    }
    if (!EMAIL_RE.test(form.email)) {
      next.email = 'Email no válido';
    }
    if (form.msg.trim().length < 5) {
      next.msg = 'Cuéntame un poco más';
    }
    setErrs(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    setSending(true);
    setFailed(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error('request failed');
      }
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="sec contact divider" id="contacto">
      <div className="wrap contact-inner">
        <div className="contact-head reveal">
          <span className="eyebrow">// INITIATE_CONTACT</span>
          <h2 className="display" style={{ fontSize: 'clamp(2rem,5vw,3rem)', margin: '0.75rem 0' }}>
            HABLEMOS
          </h2>
          <p className="muted">
            ¿Tienes un proyecto en mente o quieres construir algo con IA? Envíame una señal.
          </p>
        </div>
        {sent ? (
          <div className="form-ok reveal">SEÑAL ENVIADA // Gracias, te responderé pronto.</div>
        ) : (
          <form
            className="form-row reveal"
            onSubmit={async (e) => {
              e.preventDefault();
              await submit();
            }}
            noValidate
          >
            <div className="form-row two">
              <div className={`field${errs.name ? ' err' : ''}`}>
                <label htmlFor="name">NOMBRE</label>
                <input
                  id="name"
                  aria-label="Nombre"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Tu nombre"
                />
                {errs.name && <span className="err-msg">{errs.name}</span>}
              </div>
              <div className={`field${errs.email ? ' err' : ''}`}>
                <label htmlFor="email">EMAIL</label>
                <input
                  id="email"
                  type="email"
                  aria-label="Email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="tu@correo.com"
                />
                {errs.email && <span className="err-msg">{errs.email}</span>}
              </div>
            </div>
            <div className={`field${errs.msg ? ' err' : ''}`}>
              <label htmlFor="msg">MENSAJE</label>
              <textarea
                id="msg"
                aria-label="Mensaje"
                value={form.msg}
                onChange={set('msg')}
                placeholder="Cuéntame sobre tu proyecto…"
              />
              {errs.msg && <span className="err-msg">{errs.msg}</span>}
            </div>
            <button
              className="btn"
              type="submit"
              disabled={sending}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {sending ? 'ENVIANDO…' : 'ENVIAR TRANSMISIÓN'}
            </button>
            {failed && (
              <span className="err-msg" role="alert">
                No se pudo enviar. Intenta de nuevo o escríbeme a {PROFILE.email}.
              </span>
            )}
          </form>
        )}
        <div className="contact-meta">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <span>{PROFILE.phone}</span>
          <span>{PROFILE.location}</span>
        </div>
      </div>
    </section>
  );
}
