// Fungsi memuat header & footer
function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (id === 'header') highlightActiveNavLink();
    });
}

// Highlight menu aktif di navbar
function highlightActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop();
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Fungsi load RSS berita
function loadRSSNews() {
  const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.marinelink.com/news/rss';

  fetch(rssUrl)
    .then(res => res.json())
    .then(data => {
      const news = data.items.slice(0, 7); // Ambil 7 berita
      const newsContainer = document.getElementById('rss-news');

      const positions = [
        'top-left', 'top-center', 'top-right',
        'middle',
        'bottom-left', 'bottom-center', 'bottom-right'
      ];

      news.forEach((item, index) => {
        const area = positions[index];
        const card = document.createElement('a');
        card.className = `news-card ${area}`;
        card.style.gridArea = area;
        card.href = item.link;
        card.target = "_blank";

        // Ambil gambar
        let imageSrc = item.thumbnail;

        if (!imageSrc || imageSrc === "") {
          const match = item.content.match(/<img[^>]+src="([^">]+)"/i);
          imageSrc = match ? match[1] : 'images/pipa.jpg';
        }


        const pubDate = new Date(item.pubDate).toLocaleDateString('id-ID', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        card.innerHTML = `
         
            <strong>${item.title}</strong>
            <p>${pubDate}</p>
          </div>
        `;

        newsContainer.appendChild(card);
      });
    })
    .catch(error => {
      const newsContainer = document.getElementById('rss-news');
      if (newsContainer) {
        newsContainer.innerHTML = '<p style="color:white;">Gagal memuat berita.</p>';
      }
      console.error('RSS Fetch error:', error);
    });
}

// Jalankan saat halaman siap
window.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html");
  loadRSSNews();
});
