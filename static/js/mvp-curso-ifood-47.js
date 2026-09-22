// Preserve only campaign attribution parameters supplied to this landing page.
    // The source link's session-specific _gl value is intentionally not reused.
    (() => {
      const incoming = new URLSearchParams(window.location.search);
      const allowed = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','src','sck','fbclid','gclid'];
      document.querySelectorAll('a.checkout').forEach(link => {
        const destination = new URL(link.href);
        allowed.forEach(key => { const value = incoming.get(key); if (value) destination.searchParams.set(key, value); });
        link.href = destination.toString();
      });
    })();

    // Scroll-reveal (o CSS já desativa isso sozinho para quem prefere menos movimento)
    (() => {
      const targets = document.querySelectorAll('.ribbon,.section-title,.section-lead,.card,.proof-grid img,.mentor,.guarantee,.faq-grid details,.closing');
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.15 });
      targets.forEach(el => io.observe(el));
    })();
