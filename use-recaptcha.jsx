import { useState, useEffect } from "react";

export default function useRecaptcha(siteKeyParam) {
  const siteKey = siteKeyParam;
  const [reCaptchaInstance, setReCaptchaInstance] = useState(null);
  const [ready, setReady] = useState(false);
  const recaptchaScriptUrl = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  let _onReady = () => {};

  useEffect(() => {
    if (!siteKey) {
      return;
    }
    const script = document.createElement("script");
    script.src = recaptchaScriptUrl;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        setReCaptchaInstance(window.grecaptcha);
        setReady(true);
      });

      window.grecaptcha.ready(_onReady);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [siteKey, recaptchaScriptUrl]);

  function getToken(action = "submit") {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, {
            action: action,
          });
          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  function onReady(callback) {
    _onReady = callback;
  }

  return { reCaptchaInstance, ready, getToken, onReady };
}
