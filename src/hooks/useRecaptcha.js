import { useEffect, useRef, useState } from 'react';

// Google reCAPTCHA Site Key
const RECAPTCHA_SITE_KEY = '6LewFFMsAAAAAIms9CtM7kkW0NJkY_JOpvj9IxSw';

export const useRecaptcha = (step, onVerify, onExpire) => {
  const containerRef = useRef(null);
  const widgetId = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Check if script is loaded
  useEffect(() => {
    if (window.grecaptcha && window.grecaptcha.render) {
      setIsReady(true);
    } else {
      const interval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          setIsReady(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (step === 'recaptcha' && containerRef.current && isReady) {
      if (widgetId.current !== null) {
        try {
          window.grecaptcha.reset(widgetId.current);
        } catch (e) {
          console.warn('Recaptcha reset failed', e);
        }
      } else {
        try {
          widgetId.current = window.grecaptcha.render(containerRef.current, {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: onVerify,
            'expired-callback': onExpire,
            theme: 'light',
            size: 'normal'
          });
        } catch (e) {
          console.error('Recaptcha render failed', e);
        }
      }
    }
  }, [step, isReady, onVerify, onExpire]);

  return { containerRef };
};
