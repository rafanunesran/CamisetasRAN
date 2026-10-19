// Registro do service worker e botão "Instalar app".
(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Falha ao registrar service worker:', err));
        });
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    let deferredPrompt = null;
    let btn = null;

    function createButton(onClick) {
        if (btn) return btn;
        btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = '&#11015;&#xFE0E; Instalar app';
        btn.setAttribute('aria-label', 'Instalar aplicativo');
        btn.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;background:#2E3A87;color:#fff;border:none;border-radius:9999px;padding:10px 18px;font:600 14px "PT Sans",sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;';
        btn.addEventListener('click', onClick);
        document.body.appendChild(btn);
        return btn;
    }

    function hideButton() {
        if (btn) { btn.remove(); btn = null; }
    }

    // Chrome, Edge, Android: prompt nativo de instalação
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        createButton(async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            hideButton();
        });
    });

    window.addEventListener('appinstalled', hideButton);

    // iPhone/iPad (Safari) não tem prompt: mostra instrução
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) {
        window.addEventListener('load', () => {
            createButton(() => {
                alert('Para instalar: toque no botão Compartilhar (quadrado com seta) e depois em "Adicionar à Tela de Início".');
            });
        });
    }
})();
