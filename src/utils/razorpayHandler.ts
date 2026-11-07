export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface LaunchRazorpayParams {
  keyId: string;
  amount: number; // in INR
  planTitle: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (payment: RazorpayPaymentSuccess) => void;
  onDismiss?: () => void;
  onError?: (error: string) => void;
}

export async function launchRazorpayCheckout(params: LaunchRazorpayParams): Promise<boolean> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !(window as any).Razorpay) {
    if (params.onError) {
      params.onError('Razorpay SDK लोड नहीं हो सका। कृपया इंटरनेट कनेक्शन जांचें।');
    }
    return false;
  }

  // Check if admin has configured an official rzp_ key in settings
  let adminConfiguredKey = '';
  try {
    const rawSettings = localStorage.getItem('astrodost_admin_settings');
    if (rawSettings) {
      const parsed = JSON.parse(rawSettings);
      if (parsed?.razorpayKeyId) {
        adminConfiguredKey = parsed.razorpayKeyId.trim();
      }
    }
  } catch {
    // ignore
  }

  const effectiveKey =
    (adminConfiguredKey && (adminConfiguredKey.startsWith('rzp_test_') || adminConfiguredKey.startsWith('rzp_live_')))
      ? adminConfiguredKey
      : params.keyId?.trim() ||
        (import.meta as any).env?.VITE_RAZORPAY_KEY_ID ||
        '';

  if (!effectiveKey) {
    if (params.onError) {
      params.onError('Razorpay Key ID उपलब्ध नहीं है। कृपया एडमिन पोर्टल में अपनी Razorpay Key ID (rzp_live_... / rzp_test_...) दर्ज करें या UPI QR का उपयोग करें।');
    }
    return false;
  }

  // Check if OpenRouter key was mistakenly entered as Razorpay key
  if (effectiveKey.startsWith('sk-or-v1-')) {
    if (params.onError) {
      params.onError('ध्यान दें: आपने OpenRouter AI Key (sk-or-v1-...) दर्ज की है, जो AI मॉडल्स के लिए है। Razorpay Key ID हमेशा "rzp_live_" या "rzp_test_" से शुरू होती है। कृपया Razorpay Dashboard (Settings > API Keys) से सही Key ID दर्ज करें या UPI QR से तुरंत भुगतान करें।');
    }
    return false;
  }

  // Razorpay Key IDs must strictly start with rzp_test_ or rzp_live_
  if (!effectiveKey.startsWith('rzp_test_') && !effectiveKey.startsWith('rzp_live_')) {
    if (params.onError) {
      params.onError(`मौजूदा Razorpay Key ID ('${effectiveKey.slice(0, 8)}...') अमान्य फॉर्मेट में है। Razorpay Key ID 'rzp_test_' या 'rzp_live_' से शुरू होनी चाहिए। कृपया Razorpay Dashboard (Settings > API Keys) से सही Key ID लेकर एडमिन पोर्टल में सहेजें या UPI QR से तुरंत भुगतान करें।`);
    }
    return false;
  }

  const options = {
    key: effectiveKey,
    amount: Math.round(params.amount * 100), // in paise
    currency: 'INR',
    name: 'AstroDost AI',
    description: params.planTitle,
    image: 'https://cdn-icons-png.flaticon.com/512/3257/3257744.png',
    handler: function (response: any) {
      params.onSuccess({
        razorpay_payment_id: response.razorpay_payment_id || `RZP-${Date.now().toString(36).toUpperCase()}`,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    prefill: {
      name: params.customerName || 'AstroDost Seeker',
      email: params.customerEmail || 'client@astrodost.ai',
      contact: params.customerPhone || '9888600000',
    },
    notes: {
      service: 'Vedic Astrology & Numerology Suite',
      plan: params.planTitle,
    },
    theme: {
      color: '#059669', // Emerald
    },
    modal: {
      ondismiss: function () {
        if (params.onDismiss) params.onDismiss();
      },
    },
  };

  try {
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    return true;
  } catch (err: any) {
    if (params.onError) {
      params.onError(err?.message || 'Razorpay गेटवे खोलने में त्रुटि हुई।');
    }
    return false;
  }
}
